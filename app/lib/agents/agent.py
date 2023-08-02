from typing import Any

from langchain.agents import (
    AgentExecutor,
    AgentType,
    LLMSingleActionAgent,
    initialize_agent,
)
from langchain.chains import LLMChain
from langchain.prompts import MessagesPlaceholder

from app.lib.agents.strategy import AgentStrategy
from app.lib.parsers import CustomOutputParser


class DefaultAgent(AgentStrategy):
    def __init__(self, agent_base):
        self.agent_base = agent_base

    def get_agent(self, session: str = None) -> Any:
        llm = self.agent_base._get_llm()
        memory = self.agent_base._get_memory(session)
        prompt = self.agent_base._get_prompt()
        agent = LLMChain(
            llm=llm,
            memory=memory,
            verbose=True,
            prompt=prompt,
            output_key="output",
        )

        return agent


class OpenAIAgent(AgentStrategy):
    def __init__(self, agent_base):
        self.agent_base = agent_base

    def get_agent(self, session: str = None) -> Any:
        llm = self.agent_base._get_llm()
        tools = self.agent_base._get_tools()
        memory = self.agent_base._get_memory(session)
        prompt = self.agent_base._get_prompt()
        agent = initialize_agent(
            tools=tools,
            llm=llm,
            agent=AgentType.OPENAI_FUNCTIONS,
            system_message=prompt,
            agent_kwargs={
                "system_message": prompt,
                "extra_prompt_messages": [
                    MessagesPlaceholder(variable_name="chat_history")
                ]
                if self.agent_base.has_memory
                else None,
            },
            verbose=True,
            memory=memory,
            return_intermediate_steps=True,
        )

        return agent


class ReactAgent(AgentStrategy):
    def __init__(self, agent_base):
        self.agent_base = agent_base

    def get_agent(self, session: str = None) -> Any:
        llm = self.agent_base._get_llm()
        memory = self.agent_base._get_memory(session)
        tools = self.agent_base._get_tools()
        output_parser = CustomOutputParser()
        tool_names = [tool.name for tool in tools]
        prompt = self.agent_base._get_prompt(tools=tools)
        llm_chain = LLMChain(llm=llm, prompt=prompt)
        agent_config = LLMSingleActionAgent(
            llm_chain=llm_chain,
            output_parser=output_parser,
            stop=["\nObservation:"],
            allowed_tools=tool_names,
        )
        agent = AgentExecutor.from_agent_and_tools(
            agent=agent_config,
            tools=tools,
            verbose=True,
            memory=memory,
            return_intermediate_steps=True,
        )

        return agent
