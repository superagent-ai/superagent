import asyncio
from typing import Any, List

from app.agents.base import AgentBase
from app.utils.streaming import CustomAsyncIteratorCallbackHandler
from prisma.models import Workflow
from decouple import config

from agentops.langchain_callback_handler import LangchainCallbackHandler


agentops_api_key = config("AGENTOPS_API_KEY")
agentops_org_key = config("AGENTOPS_ORG_KEY")


class WorkflowBase:
    def __init__(
        self,
        workflow: Workflow,
        callbacks: List[CustomAsyncIteratorCallbackHandler],
        session_id: str,
        enable_streaming: bool = False,
    ):
        self.workflow = workflow
        self.enable_streaming = enable_streaming
        self.session_id = session_id

        self.agentops_handler = LangchainCallbackHandler(api_key=agentops_api_key,
                                                         org_key=agentops_org_key,
                                                         tags=[session_id, workflow.id])

        self.callbacks = callbacks

    async def arun(self, input: Any):
        self.workflow.steps.sort(key=lambda x: x.order)
        previous_output = input
        steps_output = {}
        stepIndex = 0

        for step in self.workflow.steps:
            agent = await AgentBase(
                agent_id=step.agentId,
                enable_streaming=True,
                callback=self.callbacks[stepIndex],
                session_tracker=self.agentops_handler,
                session_id=self.session_id,
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
