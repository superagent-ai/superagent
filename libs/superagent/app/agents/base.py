from abc import ABC, abstractmethod
from functools import cached_property
from typing import Any, List, Optional

from langchain.agents import AgentExecutor
from pydantic import BaseModel

from app.models.request import LLMParams as LLMParamsRequest
from app.utils.callbacks import CustomAsyncIteratorCallbackHandler
from prisma.enums import AgentType, LLMProvider
from prisma.models import LLM, Agent


class LLMParams(BaseModel):
    temperature: Optional[float] = 0.1
    max_tokens: Optional[int]
    aws_access_key_id: Optional[str] = None
    aws_secret_access_key: Optional[str] = None
    aws_region_name: Optional[str] = None


class LLMData(BaseModel):
    llm: LLM
    params: LLMParams
    model: str


class AgentBase(ABC):
    _input: str
    _messages: list = []
    prompt: Any
    tools: Any
    session_id: str
    enable_streaming: bool
    output_schema: str
    callbacks: List[CustomAsyncIteratorCallbackHandler]
    agent_data: Agent
    llm_data: LLMData

    def __init__(
        self,
        session_id: str,
        enable_streaming: bool = False,
        output_schema: str = None,
        callbacks: List[CustomAsyncIteratorCallbackHandler] = [],
        llm_data: LLMData = None,
        agent_data: Agent = None,
    ):
        self.session_id = session_id
        self.enable_streaming = enable_streaming
        self.output_schema = output_schema
        self.callbacks = callbacks
        self.llm_data = llm_data
        self.agent_data = agent_data

    @property
    def input(self):
        return self._input

    @input.setter
    def input(self, value: str):
        self._input = value

    @property
    def messages(self):
        return self._messages

    @messages.setter
    def messages(self, value: list):
        self._messages = value

    @property
    @abstractmethod
    def prompt(self) -> Any:
        ...

    @property
    @abstractmethod
    def tools(self) -> Any:
        ...

    # TODO: Set a proper return type when we remove Langchain agent type
    @cached_property
    async def memory(self) -> Any:
        ...

    @abstractmethod
    def get_agent(self) -> AgentExecutor:
        ...


class AgentFactory:
    def __init__(
        self,
        session_id: str = None,
        enable_streaming: bool = False,
        output_schema: str = None,
        callbacks: List[CustomAsyncIteratorCallbackHandler] = [],
        llm_params: Optional[LLMParamsRequest] = {},
        agent_data: Agent = None,
    ):
        self.session_id = session_id
        self.enable_streaming = enable_streaming
        self.output_schema = output_schema
        self.callbacks = callbacks
        self.api_llm_params = llm_params
        self.agent_data = agent_data

    @property
    def llm_data(self):
        llm = self.agent_data.llms[0].llm
        params = self.api_llm_params.dict() if self.api_llm_params else {}

        options = {
            **(self.agent_data.metadata or {}),
            **(llm.options or {}),
            **(params),
        }

        params = LLMParams(
            temperature=options.get("temperature"),
            max_tokens=options.get("max_tokens"),
            aws_access_key_id=(
                options.get("aws_access_key_id")
                if llm.provider == LLMProvider.BEDROCK
                else None
            ),
            aws_secret_access_key=(
                options.get("aws_secret_access_key")
                if llm.provider == LLMProvider.BEDROCK
                else None
            ),
            aws_region_name=(
                options.get("aws_region_name")
                if llm.provider == LLMProvider.BEDROCK
                else None
            ),
        )

        return LLMData(
            llm=llm,
            params=LLMParams.parse_obj(options),
            model=self.agent_data.llmModel or self.agent_data.metadata.get("model"),
        )

    async def get_agent(self):
        if self.agent_data.type == AgentType.OPENAI_ASSISTANT:
            from app.agents.openai import OpenAiAssistant

            agent = OpenAiAssistant(
                session_id=self.session_id,
                enable_streaming=self.enable_streaming,
                output_schema=self.output_schema,
                callbacks=self.callbacks,
                llm_data=self.llm_data,
                agent_data=self.agent_data,
            )

        elif self.agent_data.type == AgentType.LLM:
            from app.agents.llm import LLMAgent

            agent = LLMAgent(
                session_id=self.session_id,
                enable_streaming=self.enable_streaming,
                output_schema=self.output_schema,
                callbacks=self.callbacks,
                llm_data=self.llm_data,
                agent_data=self.agent_data,
            )

        else:
            from app.agents.langchain import LangchainAgent

            agent = LangchainAgent(
                session_id=self.session_id,
                enable_streaming=self.enable_streaming,
                output_schema=self.output_schema,
                callbacks=self.callbacks,
                llm_data=self.llm_data,
                agent_data=self.agent_data,
            )

        return await agent.get_agent()
