from typing import Any, List, Dict

from app.agents.base import AgentBase
from app.memory.base import Memory
from decouple import config
from prisma.models import Agent, AgentDatasource, AgentLLM, AgentTool
from app.datasource.types import (
    VALID_UNSTRUCTURED_DATA_TYPES,
)
from app.tools.chitchat import ChitChatTool
from app.completion.base import Completion


class SuperagentAgent(AgentBase):
    async def _get_tools(
        self, agent_datasources: List[AgentDatasource], agent_tools: List[AgentTool]
    ) -> List:
        tools = [ChitChatTool]
        return tools

    async def _get_prompt(self, agent: Agent) -> str:
        # Implement the method specific to the Open Source LLM Agent
        pass

    async def _get_memory(self) -> List:
        memory = Memory(
            session_id=f"{self.agent_id}-{self.session_id}"
            if self.session_id
            else f"{self.agent_id}",
            url=config("MEMORY_API_URL"),
        )
        chat_memory = await memory.init()
        return chat_memory

    async def _run_completion(self) -> Dict:
        pass

    async def arun(self) -> None:
        pass

    async def get_agent(self, config: Agent) -> Any:
        memory = await self._get_memory()
        tools = await self._get_tools(
            agent_datasources=config.datasources, agent_tools=config.tools
        )
        prompt = await self._get_prompt(agent=config)
        return Completion(
            memory=memory,
            prompt=prompt,
            tools=tools,
            llm=config.llms[0],
            model=config.llmModel,
        )
