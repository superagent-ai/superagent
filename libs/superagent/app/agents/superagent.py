from typing import Any, List

from app.agents.base import AgentBase
from prisma.models import Agent, AgentDatasource, AgentLLM, AgentTool


class SuperagentAgent(AgentBase):
    async def _get_tools(
        self, agent_datasources: List[AgentDatasource], agent_tools: List[AgentTool]
    ) -> List:
        # Implement the method specific to the Open Source LLM Agent
        pass

    async def _get_llm(self, agent_llm: AgentLLM, model: str) -> Any:
        # Implement the method specific to the Open Source LLM Agent
        pass

    async def _get_prompt(self, agent: Agent) -> str:
        # Implement the method specific to the Open Source LLM Agent
        pass

    async def _get_memory(self) -> List:
        # Implement the method specific to the Open Source LLM Agent
        pass

    async def get_agent(self, config: Agent) -> Any:
        # Implement the method specific to the Open Source LLM Agent
        pass
