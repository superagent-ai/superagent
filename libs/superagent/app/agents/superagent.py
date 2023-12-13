import json
from typing import Any, Callable, List, Tuple

from decouple import config
from slugify import slugify

from app.agents import Superagent
from app.agents.base import AgentBase
from app.memory.base import Memory
from app.tools import OSS_TOOL_TYPE_MAPPING
from app.tools.unstructured_datasource import UnstructuredDataSourceTool
from app.tools.noop import NoopTool
from app.utils.llm import HUGGINGFACE_MODEL_MAPPING
from prisma.models import Agent, AgentDatasource, AgentLLM, AgentTool


def recursive_json_loads(data):
    if isinstance(data, str):
        try:
            data = json.loads(data)
        except json.JSONDecodeError:
            return data
    if isinstance(data, dict):
        return {k: recursive_json_loads(v) for k, v in data.items()}
    if isinstance(data, list):
        return [recursive_json_loads(v) for v in data]
    return data


class SuperagentAgent(AgentBase):
    async def _get_tools(
        self, agent_datasources: List[AgentDatasource], agent_tools: List[AgentTool]
    ) -> List[Callable]:
        tools = []
        for agent_datasource in agent_datasources:
            metadata = {
                "datasource_id": agent_datasource.datasource.id,
            }
            tool = UnstructuredDataSourceTool(
                name=slugify(agent_datasource.datasource.name),
                description=agent_datasource.datasource.description,
                metadata=metadata,
            )
            tools.append(tool)
        for agent_tool in agent_tools:
            metadata = recursive_json_loads(agent_tool.tool.metadata)
            tool = OSS_TOOL_TYPE_MAPPING[agent_tool.tool.type](
                name=slugify(agent_tool.tool.name),
                description=agent_tool.tool.description,
                metadata=metadata,
            )
            tools.append(tool)
        return tools

    async def _get_memory(self) -> Memory:
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
                "api_base": agent_llm.llm.options.get("api_base")
                if agent_llm.llm.options
                else None,
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
