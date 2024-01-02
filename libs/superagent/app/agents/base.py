from typing import Any, List

from app.utils.prisma import prisma
from app.utils.streaming import CustomAsyncIteratorCallbackHandler
from prisma.models import Agent, AgentDatasource, AgentLLM, AgentTool

DEFAULT_PROMPT = (
    "You are a helpful AI Assistant, anwer the users questions to "
    "the best of your ability."
)


class AgentBase:
    def __init__(
        self,
        agent_id: str,
        session_id: str = None,
        enable_streaming: bool = False,
        output_schema: str = None,
        callback: CustomAsyncIteratorCallbackHandler = None,
    ):
        self.agent_id = agent_id
        self.session_id = session_id
        self.enable_streaming = enable_streaming
        self.output_schema = output_schema
        self.callback = callback

    async def _get_tools(
        self, agent_datasources: List[AgentDatasource], agent_tools: List[AgentTool]
    ) -> List:
        raise NotImplementedError

    async def _get_llm(self, agent_llm: AgentLLM, model: str) -> Any:
        raise NotImplementedError

    async def _get_prompt(self, agent: Agent) -> str:
        raise NotImplementedError

    async def _get_memory(self) -> List:
        raise NotImplementedError

    async def get_agent(self):
        agent_config = await prisma.agent.find_unique_or_raise(
            where={"id": self.agent_id},
            include={
                "llms": {"include": {"llm": True}},
                "datasources": {
                    "include": {"datasource": {"include": {"vectorDb": True}}}
                },
                "tools": {"include": {"tool": True}},
            },
        )

        if agent_config.llms[0].llm.provider in ["OPENAI", "AZURE_OPENAI"]:
            from app.agents.langchain import LangchainAgent

            agent = LangchainAgent(
                agent_id=self.agent_id,
                session_id=self.session_id,
                enable_streaming=self.enable_streaming,
                output_schema=self.output_schema,
                callback=self.callback,
            )
        else:
            from app.agents.superagent import SuperagentAgent

            agent = SuperagentAgent(
                agent_id=self.agent_id,
                session_id=self.session_id,
                enable_streaming=self.enable_streaming,
                output_schema=self.output_schema,
                callback=self.callback,
            )

        return await agent.get_agent(config=agent_config)
