import json
from typing import Any, List

from decouple import config
from langchain.agents import AgentType, initialize_agent
from langchain.chat_models import ChatOpenAI
from langchain.memory.motorhead_memory import MotorheadMemory
from langchain.prompts import MessagesPlaceholder
from langchain.schema import SystemMessage
from slugify import slugify

from app.datasource.types import (
    VALID_UNSTRUCTURED_DATA_TYPES,
)
from app.models.tools import DatasourceInput
from app.tools import TOOL_TYPE_MAPPING, create_tool
from app.tools.datasource import DatasourceTool, StructuredDatasourceTool
from app.utils.llm import LLM_MAPPING
from app.utils.prisma import prisma
from app.utils.streaming import CustomAsyncIteratorCallbackHandler
from prisma.models import Agent, AgentDatasource, AgentLLM, AgentTool

DEFAULT_PROMPT = "You are a helpful AI Assistant"


class AgentBase:
    def __init__(
        self,
        agent_id: str,
        session_id: str = None,
        enable_streaming: bool = False,
        callback: CustomAsyncIteratorCallbackHandler = None,
    ):
        self.agent_id = agent_id
        self.session_id = session_id
        self.enable_streaming = enable_streaming
        self.callback = callback

    async def _get_tools(
        self, agent_datasources: List[AgentDatasource], agent_tools: List[AgentTool]
    ) -> List:
        tools = []
        for agent_datasource in agent_datasources:
            tool_type = (
                DatasourceTool
                if agent_datasource.datasource.type in VALID_UNSTRUCTURED_DATA_TYPES
                else StructuredDatasourceTool
            )
            metadata = (
                {"datasource_id": agent_datasource.datasource.id, "query_type": "all"}
                if tool_type == DatasourceTool
                else {"datasource": agent_datasource.datasource}
            )
            tool = tool_type(
                metadata=metadata,
                args_schema=DatasourceInput,
                name=slugify(agent_datasource.datasource.name),
                description=agent_datasource.datasource.description,
            )
            tools.append(tool)
        for agent_tool in agent_tools:
            tool_info = TOOL_TYPE_MAPPING.get(agent_tool.tool.type)
            if tool_info:
                tool = create_tool(
                    tool_class=tool_info["class"],
                    name=agent_tool.tool.name,
                    description=agent_tool.tool.description,
                    metadata=agent_tool.tool.metadata,
                    args_schema=tool_info["schema"],
                )
            tools.append(tool)
        return tools

    async def _get_llm(self, agent_llm: AgentLLM) -> Any:
        if agent_llm.llm.provider == "OPENAI":
            return ChatOpenAI(
                model=LLM_MAPPING[agent_llm.llm.model],
                openai_api_key=agent_llm.llm.apiKey,
                temperature=0,
                streaming=self.enable_streaming,
                callbacks=[self.callback] if self.enable_streaming else [],
                **(agent_llm.llm.options if agent_llm.llm.options else {}),
            )

    async def _get_prompt(self, agent: Agent) -> SystemMessage:
        return SystemMessage(content=agent.prompt or DEFAULT_PROMPT)

    async def _get_memory(self) -> MotorheadMemory:
        memory = MotorheadMemory(
            session_id=f"{self.agent_id}-{self.session_id}",
            memory_key="chat_history",
            client_id=config("MOTORHEAD_CLIENT_ID"),
            api_key=config("MOTORHEAD_API_KEY"),
            return_messages=True,
            output_key="output",
        )
        await memory.init()
        return memory

    async def get_agent(self) -> Any:
        config = await prisma.agent.find_unique_or_raise(
            where={"id": self.agent_id},
            include={
                "llms": {"include": {"llm": True}},
                "datasources": {"include": {"datasource": True}},
                "tools": {"include": {"tool": True}},
            },
        )
        tools = await self._get_tools(
            agent_datasources=config.datasources, agent_tools=config.tools
        )
        llm = await self._get_llm(agent_llm=config.llms[0])
        prompt = await self._get_prompt(agent=config)
        memory = await self._get_memory()
        agent = initialize_agent(
            tools,
            llm,
            agent=AgentType.OPENAI_FUNCTIONS,
            agent_kwargs={
                "system_message": prompt,
                "extra_prompt_messages": [
                    MessagesPlaceholder(variable_name="chat_history")
                ],
            },
            memory=memory,
            return_intermediate_steps=True,
            verbose=True,
        )
        return agent
