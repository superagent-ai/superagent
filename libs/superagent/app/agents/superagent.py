from typing import Any, List, Callable, Tuple

from app.agents.base import AgentBase
from app.memory.base import Memory
from app.utils.llm import HUGGINGFACE_MODEL_MAPPING
from decouple import config
from prisma.models import Agent, AgentDatasource, AgentLLM, AgentTool
from app.agents import Superagent
from app.datasource.types import (
    VALID_UNSTRUCTURED_DATA_TYPES,
)
from app.tools.browser import browser


class SuperagentAgent(AgentBase):
    async def _get_tools(
        self, agent_datasources: List[AgentDatasource], agent_tools: List[AgentTool]
    ) -> List[Callable]:
        tools = [browser]
        return tools

    async def _get_memory(self) -> Tuple[str, List[Any]]:
        memory = Memory(
            session_id=f"{self.agent_id}-{self.session_id}"
            if self.session_id
            else f"{self.agent_id}",
            url=config("MEMORY_API_URL"),
        )
        return memory

    async def _get_llm(self, agent_llm: AgentLLM, model: str) -> str:
        if agent_llm.llm.provider == "HUGGINGFACE":
            return {
                "model": HUGGINGFACE_MODEL_MAPPING[model],
                "api_base": agent_llm.llm.options.get("api_base"),
                "api_key": agent_llm.llm.apiKey,
            }

    async def get_agent(self, config: Agent) -> Any:
        memory = await self._get_memory()
        tools = await self._get_tools(
            agent_datasources=config.datasources, agent_tools=config.tools
        )
        llm = await self._get_llm(agent_llm=config.llms[0], model=config.llmModel)
        agent = Superagent(
            tools=tools,
            model=llm["model"],
            api_base=llm["api_base"],
            api_key=llm["api_key"],
            memory=memory,
        )
        return agent
