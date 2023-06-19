from typing import Any
from pydantic import BaseModel, Field


from langchain.agents import (
    AgentExecutor,
    AgentType,
    LLMSingleActionAgent,
    initialize_agent,
    Tool,
)
from langchain.agents.agent_toolkits import NLAToolkit
from langchain.chains import LLMChain, RetrievalQA
from langchain.requests import RequestsWrapper
from langchain.embeddings.openai import OpenAIEmbeddings

from app.lib.agents.strategy import AgentStrategy
from app.lib.parsers import CustomOutputParser
from app.lib.prompts import openapi_format_instructions
from app.lib.vectorstores.base import VectorStoreBase


class DocumentInput(BaseModel):
    question: str = Field()


class DefaultAgent(AgentStrategy):
    def __init__(self, agent_base):
        self.agent_base = agent_base

    def get_agent(self) -> Any:
        llm = self.agent_base._get_llm()
        memory = self.agent_base._get_memory()
        agent_documents = self.agent_base.documents
        if agent_documents:
            embeddings = OpenAIEmbeddings()
            tools = [
                Tool(
                    name=agent_document.document.id,
                    args_schema=DocumentInput,
                    description=f"useful when you want to answer questions about {agent_document.document.name}",
                    func=RetrievalQA.from_chain_type(
                        llm=llm,
                        chain_type="stuff",
                        retriever=(
                            VectorStoreBase()
                            .get_database()
                            .from_existing_index(embeddings, agent_document.document.id)
                        ).as_retriever(),
                    ),
                )
                for agent_document in agent_documents
            ]
            agent = initialize_agent(
                agent=AgentType.OPENAI_FUNCTIONS,
                tools=tools,
                llm=llm,
                verbose=True,
                return_intermediate_steps=True,
                memory=memory,
            )

        else:
            agent = LLMChain(
                llm=llm,
                memory=memory,
                verbose=True,
                prompt=self.agent_base._get_prompt(),
                output_key="output",
            )

        return agent


class OpenApiDocumentAgent(AgentStrategy):
    def __init__(self, agent_base):
        self.agent_base = agent_base

    def get_agent(self) -> Any:
        llm = self.agent_base._get_llm()
        document = self.agent_base._get_documents()
        requests_wrapper = (
            RequestsWrapper(
                headers={
                    document[0].authorization["key"]: document[0].authorization["value"]
                }
            )
            if document[0].authorization
            else RequestsWrapper()
        )
        openapi_toolkit = NLAToolkit.from_llm_and_url(
            llm, document.url, requests=requests_wrapper, max_text_length=1800
        )
        tools = openapi_toolkit.get_tools()[:30]
        agent = initialize_agent(
            tools=tools,
            llm=llm,
            agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
            verbose=True,
            max_iterations=1,
            early_stopping_method="generate",
            agent_kwargs={"format_instructions": openapi_format_instructions},
            return_intermediate_steps=True,
        )

        return agent


class OpenAIAgent(AgentStrategy):
    def __init__(self, agent_base):
        self.agent_base = agent_base

    def get_agent(self) -> Any:
        llm = self.agent_base._get_llm()
        tools = self.agent_base._get_tools()
        memory = self.agent_base._get_memory()
        agent = initialize_agent(
            tools=tools,
            llm=llm,
            agent=AgentType.OPENAI_FUNCTIONS,
            verbose=True,
            memory=memory,
            return_intermediate_steps=True,
        )

        return agent


class ReactAgent(AgentStrategy):
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
