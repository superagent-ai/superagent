from typing import Any, List

from agentops.langchain_callback_handler import (
    AsyncCallbackHandler,
    LangchainCallbackHandler,
)

from app.agents.base import AgentBase
from app.utils.callbacks import CustomAsyncIteratorCallbackHandler
from app.utils.prisma import prisma
from prisma.models import Workflow


class WorkflowBase:
    def __init__(
        self,
        workflow: Workflow,
        callbacks: List[CustomAsyncIteratorCallbackHandler],
        session_id: str,
        constructor_callbacks: List[
            AsyncCallbackHandler | LangchainCallbackHandler
        ] = None,
        enable_streaming: bool = False,
    ):
        self.workflow = workflow
        self.enable_streaming = enable_streaming
        self.session_id = session_id
        self.constructor_callbacks = constructor_callbacks
        self.callbacks = callbacks

    async def arun(self, input: Any):
        previous_output = input
        steps_output = []

        for stepIndex, step in enumerate(self.workflow.steps):
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
            agent_base = AgentBase(
                agent_id=step.agentId,
                enable_streaming=self.enable_streaming,
                callbacks=self.constructor_callbacks,
                session_id=self.session_id,
                agent_config=agent_config,
            )

            agent = await agent_base.get_agent()
            agent_input = agent_base.get_input(
                previous_output,
                agent_type=agent_config.type,
            )

            agent_response = await agent.ainvoke(
                input=agent_input,
                config={
                    "callbacks": self.callbacks[stepIndex],
                },
            )

            previous_output = agent_response.get("output")
            steps_output.append(agent_response)

        return {"steps": steps_output, "output": previous_output}
