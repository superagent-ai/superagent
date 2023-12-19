from typing import Any, List, Tuple

from decouple import config

from app.agents.base import AgentBase
from app.memory.base import Memory
from prisma.models import Agent, AgentDatasource, AgentTool


class SuperagentAgent(AgentBase):
    async def _get_tools(
        self, agent_datasources: List[AgentDatasource], agent_tools: List[AgentTool]
    ) -> List:
        tools = []
        return tools

    async def _get_memory(self) -> Tuple[str, List[Any]]:
        memory = Memory(
            session_id=f"{self.agent_id}-{self.session_id}"
            if self.session_id
            else f"{self.agent_id}",
            url=config("MEMORY_API_URL"),
        )
        return memory

    async def get_agent(self, config: Agent) -> Any:
        # memory = await self._get_memory()
        # tools = await self._get_tools(
        #    agent_datasources=config.datasources, agent_tools=config.tools
        # )
        pass
