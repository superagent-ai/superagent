from typing import Any

from langchain.agents import AgentType, initialize_agent
from langchain.chains import LLMChain
from langchain.chat_models import AzureChatOpenAI, ChatOpenAI
from langchain.prompts import MessagesPlaceholder, PromptTemplate

from app.agents.base import AbstractAgent, AgentBase
from app.utils.llm import LLM_MAPPING
from prisma.models import Agent, AgentLLM

DEFAULT_PROMPT = (
    "You are a helpful AI Assistant, anwer the users questions to "
    "the best of your ability."
)


class FunctionCallingAgent(AbstractAgent, AgentBase):
    async def _get_llm(self, agent_llm: AgentLLM, model: str) -> Any:
        if agent_llm.llm.provider == "OPENAI":
            return ChatOpenAI(
                model=LLM_MAPPING[model],
                openai_api_key=agent_llm.llm.apiKey,
                temperature=0,
                streaming=self.enable_streaming,
                **(agent_llm.llm.options if agent_llm.llm.options else {}),
            )
        if agent_llm.llm.provider == "AZURE_OPENAI":
            return AzureChatOpenAI(
                api_key=agent_llm.llm.apiKey,
                temperature=0,
                openai_api_type="azure",
                streaming=self.enable_streaming,
                **(agent_llm.llm.options if agent_llm.llm.options else {}),
            )

    async def get_agent(self, config: Agent):
        llm = await self._get_llm(agent_llm=config.llms[0], model=config.llmModel)
        tools = await self._get_tools(
            agent_datasources=config.datasources, agent_tools=config.tools
        )
        prompt = await self._get_prompt(agent=config)
        memory = await self._get_memory()

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
            prompt_base = (
                f"{config.prompt.replace('{', '{{').replace('}', '}}')}"
                if config.prompt
                else None
            )
            prompt_base = prompt_base or DEFAULT_PROMPT
            prompt_question = "Question: {input}"
            prompt_history = "History: \n {chat_history}"
            prompt = f"{prompt_base} \n {prompt_question} \n {prompt_history}"

            agent = LLMChain(
                llm=llm,
                memory=memory,
                output_key="output",
                verbose=True,
                prompt=PromptTemplate.from_template(prompt),
            )
        return agent
