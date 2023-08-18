import json
import logging
import threading
from typing import Any, Dict, Generator, Optional

from decouple import config
from queue import Queue
from fastapi import APIRouter, BackgroundTasks
from starlette.responses import StreamingResponse

from app.lib.models.agent import PredictAgent
from app.lib.agents.base import AgentBase


logger = logging.getLogger(__name__)
router = APIRouter()


class AgentHandler:
    def __init__(
        self,
        agent: Any,
        body: PredictAgent,
        api_key: str,
        data_queue: Optional[Queue] = None,
    ):
        self.agent = agent
        self.body = body
        self.api_key = api_key
        self.data_queue = data_queue

    def create_agent_base(self) -> AgentBase:
        on_llm_new_token = (
            lambda token: (print(f"Token: {token}"), self.data_queue.put(token))
            if self.data_queue
            else None
        )
        on_llm_end = (
            lambda: (print("End token"), self.data_queue.put("[END]"))
            if self.data_queue
            else None
        )

        return AgentBase(
            agent=self.agent,
            has_streaming=self.body.has_streaming,
            api_key=self.api_key,
            on_llm_new_token=on_llm_new_token,
            on_llm_end=on_llm_end,
            on_chain_end=lambda outputs: None,
        )

    async def handle_streaming(
        self, agent_executor, agentId: str, background_tasks: BackgroundTasks
    ) -> StreamingResponse:
        agent_base = self.create_agent_base()
        threading.Thread(
            target=self.conversation_run_thread,
            args=(
                agent_base,
                agent_executor,
                self.body.input,
                self.body.session,
                agentId,
                background_tasks,
            ),
        ).start()
        return StreamingResponse(self.event_stream(), media_type="text/event-stream")

    def conversation_run_thread(
        self,
        agent_base: AgentBase,
        agent_executor: Any,
        message: Dict[str, Any],
        session: str,
        agentId: str,
        background_tasks: BackgroundTasks,
    ) -> None:
        result = agent_executor(
            agent_base.process_payload(payload=message.get("input"))
        )
        output = result.get("output") or result.get("result")
        self.data_queue.put(output)

        background_tasks.add_task(
            agent_base.create_agent_memory, agentId, session, "AI", output
        )

        if config("SUPERAGENT_TRACING"):
            trace = agent_base._format_trace(trace=result)
            background_tasks.add_task(agent_base.save_intermediate_steps, trace)

        self.data_queue.put("[END]")

    def event_stream(self) -> Generator[str, None, None]:
        while True:
            data = self.data_queue.get()
            if data == "[END]":
                yield f"data: {data}\n\n"
                break
            yield f"data: {data}\n\n"

    async def handle_non_streaming(
        self,
        agent_base: AgentBase,
        agent_executor: Any,
        agentId: str,
        background_tasks: BackgroundTasks,
    ) -> Dict[str, Any]:
        result = agent_executor(agent_base.process_payload(payload=self.body.input))
        output = result.get("output") or result.get("result")

        background_tasks.add_task(
            agent_base.create_agent_memory,
            agentId,
            self.body.session,
            "HUMAN",
            json.dumps(self.body.input.get("input")),
        )
        background_tasks.add_task(
            agent_base.create_agent_memory, agentId, self.body.session, "AI", output
        )

        if config("SUPERAGENT_TRACING"):
            trace = agent_base._format_trace(trace=result)
            background_tasks.add_task(agent_base.save_intermediate_steps, trace)
            return {"success": True, "data": output, "trace": json.loads(trace)}

        return {"success": True, "data": output}
