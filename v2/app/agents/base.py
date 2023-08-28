from app.utils.prisma import prisma
from typing import Any, Dict, List
from prisma.models import AgentDatasource, AgentLLM, Agent
from app.datasource.flow import VALID_FINETUNE_TYPES
from app.tools.datasource import DatasourceTool
from app.models.tools import DatasourceInput
from app.utils.llm import LLM_MAPPING

from langchain.chat_models import ChatOpenAI
from langchain.agents import AgentType, initialize_agent
from langchain.schema import SystemMessage
from langchain.prompts import MessagesPlaceholder


class AgentBase:
    def __init__(self, agent_id: str):
        self.agent_id = agent_id

    def _get_tools(self, agent_datasources: List[AgentDatasource]) -> List:
        tools = []
        for agent_datasource in agent_datasources:
            if agent_datasource.datasource.type in VALID_FINETUNE_TYPES:
                tool = DatasourceTool(
                    metadata={"agent_id": self.agent_id}, args_schema=DatasourceInput
                )
                print(tool)
                tools.append(tool)
        return tools

    def _get_llm(self, agent_llm: AgentLLM) -> Any:
        if agent_llm.llm.provider == "OPENAI":
            return ChatOpenAI(
                model=LLM_MAPPING[agent_llm.llm.model],
                openai_api_key=agent_llm.llm.apiKey,
                temperature=0,
                **(agent_llm.llm.options if agent_llm.llm.options else {}),
            )

    def _get_prompt(self, agent: Agent) -> Any:
        return SystemMessage(
            content=agent.prompt
            or "Use the functions provided to answer any questions."
        )

    async def get_agent(self):
        config = await prisma.agent.find_unique_or_raise(
            where={"id": self.agent_id},
            include={
                "llms": {"include": {"llm": True}},
                "datasources": {"include": {"datasource": True}},
            },
        )
        tools = self._get_tools(agent_datasources=config.datasources)
        llm = self._get_llm(agent_llm=config.llms[0])
        prompt = self._get_prompt(agent=config)
        agent = initialize_agent(
            tools,
            llm,
            agent=AgentType.OPENAI_FUNCTIONS,
            agent_kwargs={
                "system_message": prompt,
            },
            return_intermediate_steps=True,
        )
        return agent
