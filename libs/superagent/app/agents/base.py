from typing import Any, List, Optional

from app.models.request import LLMParams
from app.utils.callbacks import CustomAsyncIteratorCallbackHandler
from prisma.enums import AgentType
from prisma.models import Agent

DEFAULT_PROMPT = (
    "You are a helpful AI Assistant, answer the users questions to "
    "the best of your ability."
)


class AgentBase:
    def __init__(
        self,
        agent_id: str,
        session_id: str = None,
        enable_streaming: bool = False,
        output_schema: str = None,
        callbacks: List[CustomAsyncIteratorCallbackHandler] = [],
        llm_params: Optional[LLMParams] = {},
        agent_config: Agent = None,
    ):
        self.agent_id = agent_id
        self.session_id = session_id
        self.enable_streaming = enable_streaming
        self.output_schema = output_schema
        self.callbacks = callbacks
        self.llm_params = llm_params
        self.agent_config = agent_config

    async def _get_tools(
        self,
    ) -> List:
        raise NotImplementedError

    async def _get_llm(
        self,
    ) -> Any:
        raise NotImplementedError

    async def _get_prompt(
        self,
    ) -> str:
        raise NotImplementedError

    async def _get_memory(self) -> List:
        raise NotImplementedError

    async def get_agent(self):
        if self.agent_config.type == AgentType.OPENAI_ASSISTANT:
            from app.agents.openai import OpenAiAssistant

            agent = OpenAiAssistant(
                agent_id=self.agent_id,
                session_id=self.session_id,
                enable_streaming=self.enable_streaming,
                output_schema=self.output_schema,
                callbacks=self.callbacks,
                llm_params=self.llm_params,
                agent_config=self.agent_config,
            )

        elif self.agent_config.type == AgentType.LLM:
            from app.agents.llm import LLMAgent

            agent = LLMAgent(
                agent_id=self.agent_id,
                session_id=self.session_id,
                enable_streaming=self.enable_streaming,
                callbacks=self.callbacks,
                llm_params=self.llm_params,
                agent_config=self.agent_config,
            )

        else:
            from app.agents.langchain import LangchainAgent

            agent = LangchainAgent(
                agent_id=self.agent_id,
                session_id=self.session_id,
                enable_streaming=self.enable_streaming,
                output_schema=self.output_schema,
                callbacks=self.callbacks,
                llm_params=self.llm_params,
                agent_config=self.agent_config,
            )

        return await agent.get_agent()

    def get_input(self, input: str, agent_type: AgentType):
        agent_input = {
            "input": input,
        }

        if agent_type == AgentType.OPENAI_ASSISTANT:
            agent_input = {
                "content": input,
            }

        if agent_type == AgentType.LLM:
            agent_input = input

        return agent_input
