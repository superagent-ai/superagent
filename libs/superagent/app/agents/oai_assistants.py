from typing import Any, List, Tuple

from decouple import config

from app.agents.base import AgentBase
from app.memory.base import Memory
from prisma.models import Agent, AgentDatasource, AgentTool


class OpenAIAssistant(AgentBase):
    async def get_agent(self, config: Agent) -> Any:
        # memory = await self._get_memory()
        # tools = await self._get_tools(
        #    agent_datasources=config.datasources, agent_tools=config.tools
        # )
        pass
