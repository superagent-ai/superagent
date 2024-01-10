from typing import Any, Dict, List, Optional

from decouple import config
from langchain.agents import (
    AgentExecutor,
    create_react_agent,
)
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain_community.chat_models import ChatLiteLLM

from app.agents.base import AbstractAgent, AgentBase
from app.utils.helpers import get_first_non_null
from app.utils.llm import LLM_MAPPING
from prisma.models import Agent, AgentLLM

DEFAULT_PROMPT = (
    "You are a helpful AI Assistant, anwer the users questions to "
    "the best of your ability."
)


class CustomChatLiteLLM(ChatLiteLLM):
    def _get_invocation_params(
        self, stop: Optional[List[str]] = None, **kwargs: Any
    ) -> Dict[str, Any]:
        """Get the parameters used to invoke the model."""
        return {
            **super()._get_invocation_params(stop=stop),
            # need to pass model name for langfuse
            # https://github.com/langfuse/langfuse-python/blob/main/langfuse/callback.py#L634-L689
            "model_name": self.model_name,
        }


class ReActAgent(AbstractAgent, AgentBase):
    async def _get_llm(self, agent_llm: AgentLLM, model: str) -> Any:
        chat = CustomChatLiteLLM(
            model=LLM_MAPPING[model],
            huggingface_api_key=get_first_non_null(
                agent_llm.llm.apiKey, config("HUGGINGFACE_API_KEY", None)
            ),
            temperature=0,
            streaming=self.enable_streaming,
            **(agent_llm.llm.options if agent_llm.llm.options else {}),
        )
        return chat

    async def get_agent(self, config: Agent):
        memory = await self._get_memory()
        llm = await self._get_llm(agent_llm=config.llms[0], model=config.llmModel)
        tools = await self._get_tools(
            agent_datasources=config.datasources, agent_tools=config.tools
        )
        prompt = await self._get_prompt(agent=config)

        if len(tools) > 0:
            react_agent_instructions_prompt = """
                Answer the following questions as best you can. 
                You have access to the following tools, 
                use tools only and only when they can be useful. :\n\n{tools}\n\n
                
                Use the following format:\n\n
                Question: the input question you must answer\n
                Thought: you should always think about what to do\n
                Action: can be one of [{tool_names}] 
                (actions can be used only and only when the action can be useful)\n
                Action Input: the input to the action
                (actions can be used only and only when the action can be useful)\n
                Observation: the result of the action\n... 
                (this Thought/Action/Action Input/Observation can repeat N times)\n
                Thought: I now know the final answer\n
                Final Answer: the final answer to the original input question\n\n
                Begin!\n\n
                Question: {input}\n
                Thought:{agent_scratchpad}'
            """

            agent_prompt = f"{prompt} \n {react_agent_instructions_prompt} \n"

            react_agent = create_react_agent(
                llm, tools, prompt=PromptTemplate.from_template(agent_prompt)
            )

            agent_executor = AgentExecutor(
                agent=react_agent, tools=tools, verbose=True, memory=memory
            )
            return agent_executor
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
                prompt=PromptTemplate.from_template(prompt),
                memory=memory,
                output_key="output",
                verbose=True,
                llm=llm,
            )

        return agent

    def can_stream(self) -> bool:
        return False
