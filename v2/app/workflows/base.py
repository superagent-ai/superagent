from typing import Any
from prisma.models import LLM

from langchain.chat_models.openai import ChatOpenAI
from langchain.chains import SimpleSequentialChain

from app.utils.llm import LLM_MAPPING
from app.utils.prisma import prisma
from app.agents.base import AgentBase


class WorkflowBase:
    def __init__(self, workflow_id: str, enable_streaming: bool = False):
        self.workflow_id = workflow_id
        self.enable_streaming = enable_streaming

    async def arun(self, input: Any) -> Any:
        workflow = await prisma.workflow.find_unique(
            where={"id": self.workflow_id},
            include={"steps": True},
        )
        workflow.steps.sort(key=lambda x: x.order)
        previous_output = input
        steps_output = {}
        for step in workflow.steps:
            agent = await AgentBase(agent_id=step.agentId).get_agent()
            agent_response = await agent.acall(inputs={"input": previous_output})
            previous_output = agent_response.get("output")
            steps_output[step.order] = agent_response
        return {"steps": steps_output, "output": previous_output}
