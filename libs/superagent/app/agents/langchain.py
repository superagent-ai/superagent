import datetime
from functools import cached_property

from decouple import config
from langchain.agents import AgentType, initialize_agent
from langchain.chains import LLMChain
from langchain.memory import (
    ConversationBufferWindowMemory,
    MotorheadMemory,
    RedisChatMessageHistory,
)
from langchain.prompts import MessagesPlaceholder, PromptTemplate
from langchain.schema import SystemMessage
from langchain_community.tools import BaseTool
from langchain_openai import AzureChatOpenAI, ChatOpenAI

from app.agents.base import AgentBase
from app.tools import get_tools
from app.utils.llm import LLM_MAPPING
from prisma.enums import LLMProvider
from prompts.default import DEFAULT_PROMPT
from prompts.json import JSON_FORMAT_INSTRUCTIONS


class LangchainAgent(AgentBase):
    @property
    def tools(self) -> list[BaseTool]:
        return get_tools(agent_data=self.agent_data, session_id=self.session_id)

    @property
    def prompt(self):
        base_prompt = self.agent_data.prompt or DEFAULT_PROMPT
        content = f"Current date: {datetime.datetime.now().strftime('%Y-%m-%d')}\n"

        if self.output_schema:
            content += JSON_FORMAT_INSTRUCTIONS.format(
                base_prompt=base_prompt, output_schema=self.output_schema
            )
        else:
            content += f"{base_prompt}"

        return SystemMessage(content=content)

    def _get_llm(self):
        llm_data = self.llm_data
        llm_data.params.dict(exclude_unset=True)

        if llm_data.llm.provider == LLMProvider.OPENAI:
            return ChatOpenAI(
                model=LLM_MAPPING[self.llm_data.model],
                openai_api_key=llm_data.llm.apiKey,
                streaming=self.enable_streaming,
                callbacks=self.callbacks,
                temperature=llm_data.params.temperature,
                max_tokens=llm_data.params.max_tokens,
            )
        elif llm_data.llm.provider == LLMProvider.AZURE_OPENAI:
            return AzureChatOpenAI(
                api_key=llm_data.llm.apiKey,
                streaming=self.enable_streaming,
                callbacks=self.callbacks,
                temperature=llm_data.params.temperature,
                max_tokens=llm_data.params.max_tokens,
            )

    @cached_property
    async def memory(self) -> None | MotorheadMemory | ConversationBufferWindowMemory:
        # if memory is already set, in the main agent base class, return it
        if not self.session_id:
            raise ValueError("Session ID is required to initialize memory")

        memory_type = config("MEMORY", "motorhead")
        if memory_type == "redis":
            memory = ConversationBufferWindowMemory(
                chat_memory=RedisChatMessageHistory(
                    session_id=self.session_id,
                    url=config("REDIS_MEMORY_URL", "redis://localhost:6379/0"),
                    key_prefix="superagent:",
                ),
                memory_key="chat_history",
                return_messages=True,
                output_key="output",
                k=config("REDIS_MEMORY_WINDOW", 10),
            )
        else:
            memory = MotorheadMemory(
                session_id=self.session_id,
                memory_key="chat_history",
                url=config("MEMORY_API_URL"),
                return_messages=True,
                output_key="output",
            )
            await memory.init()
        return memory

    async def get_agent(self):
        llm = self._get_llm()
        memory = await self.memory
        tools = self.tools
        prompt = self.prompt

        if len(tools) > 0:
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
        else:
            user_prompt = prompt.content.replace("{", "{{").replace("}", "}}")
            user_input = "Question: {input}"
            prompt_history = "History: \n {chat_history}"
            prompt_template = f"{user_prompt} \n {user_input} \n {prompt_history}"

            agent = LLMChain(
                llm=llm,
                memory=memory,
                output_key="output",
                verbose=True,
                prompt=PromptTemplate.from_template(prompt_template),
            )

        return agent
