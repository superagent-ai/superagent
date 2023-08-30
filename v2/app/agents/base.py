from typing import Any, Dict, List

from decouple import config
from langchain.agents import AgentType, initialize_agent
from langchain.chat_models import ChatOpenAI
from langchain.memory.motorhead_memory import MotorheadMemory
from langchain.prompts import MessagesPlaceholder
from langchain.schema import SystemMessage

from app.datasource.flow import VALID_FINETUNE_TYPES
from app.models.tools import DatasourceInput
from app.tools.datasource import DatasourceTool
from app.utils.llm import LLM_MAPPING
from app.utils.prisma import prisma
from prisma.models import Agent, AgentDatasource, AgentLLM

DEFAULT_PROMPT = "You are a helpful AI Assistant"


class AgentBase:
    def __init__(self, agent_id: str, session_id: str = None):
        self.agent_id = agent_id
        self.session_id = session_id

    async def _get_tools(self, agent_datasources: List[AgentDatasource]) -> List:
        tools = []
        for agent_datasource in agent_datasources:
            if agent_datasource.datasource.type in VALID_FINETUNE_TYPES:
                tool = DatasourceTool(
                    metadata={"agent_id": self.agent_id},
                    args_schema=DatasourceInput,
                    return_direct=True,
                )
                tools.append(tool)
        return tools

    async def _get_llm(self, agent_llm: AgentLLM) -> Any:
        if agent_llm.llm.provider == "OPENAI":
            return ChatOpenAI(
                model=LLM_MAPPING[agent_llm.llm.model],
                openai_api_key=agent_llm.llm.apiKey,
                temperature=0,
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
            },
        )
        tools = await self._get_tools(agent_datasources=config.datasources)
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
        )
        return agent
