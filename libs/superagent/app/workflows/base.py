import asyncio
from typing import Any, List

from agentops.langchain_callback_handler import (
    AsyncCallbackHandler,
    LangchainCallbackHandler,
)

from app.agents.base import AgentBase
from app.utils.prisma import prisma
from app.utils.streaming import CustomAsyncIteratorCallbackHandler
from prisma.models import Workflow


class WorkflowBase:
    def __init__(
        self,
        workflow: Workflow,
        callbacks: List[CustomAsyncIteratorCallbackHandler],
        session_id: str,
        session_tracker: LangchainCallbackHandler | AsyncCallbackHandler = None,
        enable_streaming: bool = False,
    ):
        self.workflow = workflow
        self.enable_streaming = enable_streaming
        self.session_id = session_id
        self.session_tracker = session_tracker
        self.callbacks = callbacks

    async def arun(self, input: Any):
        self.workflow.steps.sort(key=lambda x: x.order)
        previous_output = input
        steps_output = {}
        stepIndex = 0

        for step in self.workflow.steps:
            agent_config = await prisma.agent.find_unique_or_raise(
                where={"id": step.agentId},
                include={
                    "llms": {"include": {"llm": True}},
                    "datasources": {
                        "include": {"datasource": {"include": {"vectorDb": True}}}
                    },
                    "tools": {"include": {"tool": True}},
                },
            )
            agent = await AgentBase(
                agent_id=step.agentId,
                enable_streaming=True,
                callback=self.callbacks[stepIndex],
                session_tracker=self.session_tracker,
                session_id=self.session_id,
                agent_config=agent_config,
            ).get_agent()

            task = asyncio.ensure_future(
                agent.acall(
                    inputs={"input": previous_output},
                )
            )

            await task
            agent_response = task.result()
            previous_output = agent_response.get("output")
            steps_output[step.order] = agent_response

            stepIndex += 1
        return {"steps": steps_output, "output": previous_output}
