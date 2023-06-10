from typing import Any

import requests
import yaml
from langchain.agents import (
    AgentExecutor,
    LLMSingleActionAgent,
)
from langchain.agents.agent_toolkits.openapi import planner
from langchain.agents.agent_toolkits.openapi.spec import reduce_openapi_spec
from langchain.chains import ConversationalRetrievalChain, LLMChain
from langchain.chains.conversational_retrieval.prompts import (
    CONDENSE_QUESTION_PROMPT,
    QA_PROMPT,
)
from langchain.chains.question_answering import load_qa_chain
from langchain.llms import OpenAI
from langchain.requests import RequestsWrapper

from app.lib.agents.strategy import AgentStrategy
from app.lib.parsers import CustomOutputParser


class DefaultAgent(AgentStrategy):
    def __init__(self, agent_base):
        self.agent_base = agent_base

    def get_agent(self) -> Any:
        llm = self.agent_base._get_llm()
        memory = self.agent_base._get_memory()
        agent = LLMChain(
            llm=llm, memory=memory, verbose=True, prompt=self.agent_base._get_prompt()
        )

        return agent


class DocumentAgent(AgentStrategy):
    def __init__(self, agent_base):
        self.agent_base = agent_base

    def get_agent(self) -> Any:
        llm = self.agent_base._get_llm()
        memory = self.agent_base._get_memory()
        document = self.agent_base._get_document()
        question_generator = LLMChain(
            llm=OpenAI(temperature=0), prompt=CONDENSE_QUESTION_PROMPT
        )
        doc_chain = load_qa_chain(
            llm, chain_type="stuff", prompt=QA_PROMPT, verbose=True
        )
        agent = ConversationalRetrievalChain(
            retriever=document.as_retriever(),
            combine_docs_chain=doc_chain,
            question_generator=question_generator,
            memory=memory,
            get_chat_history=lambda h: h,
        )

        return agent


class OpenApiDocumentAgent(AgentStrategy):
    def __init__(self, agent_base):
        self.agent_base = agent_base

    def get_agent(self) -> Any:
        llm = self.agent_base._get_llm()
        document = self.agent_base._get_document()
        requests_wrapper = (
            RequestsWrapper(
                headers={document.authorization["key"]: document.authorization["value"]}
            )
            if document.authorization
            else RequestsWrapper()
        )
        yaml_response = requests.get(document.url)
        content = yaml_response.content
        raw_api_spec = yaml.load(content, Loader=yaml.Loader)
        api_spec = reduce_openapi_spec(raw_api_spec)
        agent = planner.create_openapi_agent(api_spec, requests_wrapper, llm)

        return agent


class ToolAgent(AgentStrategy):
    def __init__(self, agent_base):
        self.agent_base = agent_base

    def get_agent(self) -> Any:
        llm = self.agent_base._get_llm()
        memory = self.agent_base._get_memory()
        tools = self.agent_base._get_tool()
        output_parser = CustomOutputParser()
        tool_names = [tool.name for tool in tools]
        llm_chain = LLMChain(llm=llm, prompt=self.agent_base._get_prompt())
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
