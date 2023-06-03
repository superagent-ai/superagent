from typing import Any

import requests
import yaml
from decouple import config
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
from langchain.chat_models import ChatAnthropic, ChatOpenAI
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.llms import Cohere, OpenAI
from langchain.memory import ChatMessageHistory, ConversationBufferMemory
from langchain.prompts.prompt import PromptTemplate
from langchain.requests import RequestsWrapper
from langchain.vectorstores.pinecone import Pinecone

from app.lib.callbacks import StreamingCallbackHandler
from app.lib.parsers import CustomOutputParser
from app.lib.prisma import prisma
from app.lib.prompts import (
    CustomPromptTemplate,
    agent_template,
    default_chat_prompt,
)
from app.lib.tools import get_search_tool


class Agent:
    def __init__(
        self,
        agent: dict,
        has_streaming: bool = False,
        on_llm_new_token=None,
        on_llm_end=None,
        on_chain_end=None,
    ):
        self.id = agent.id
        self.document = agent.document
        self.has_memory = agent.hasMemory
        self.type = agent.type
        self.llm = agent.llm
        self.prompt = agent.prompt
        self.tool = agent.tool
        self.has_streaming = has_streaming
        self.on_llm_new_token = on_llm_new_token
        self.on_llm_end = on_llm_end
        self.on_chain_end = on_chain_end

    def _get_api_key(self) -> str:
        if self.llm["provider"] == "openai-chat" or self.llm["provider"] == "openai":
            return (
                self.llm["api_key"]
                if "api_key" in self.llm
                else config("OPENAI_API_KEY")
            )

        if self.llm["provider"] == "anthropic":
            return (
                self.llm["api_key"]
                if "api_key" in self.llm
                else config("ANTHROPIC_API_KEY")
            )

        if self.llm["provider"] == "cohere":
            return (
                self.llm["api_key"]
                if "api_key" in self.llm
                else config("COHERE_API_KEY")
            )

    def _get_tool(self) -> Any:
        try:
            if self.tool.type == "SEARCH":
                tools = get_search_tool()

                return tools

        except Exception:
            return None

    def _get_prompt(self) -> Any:
        if self.prompt:
            if self.tool:
                prompt = CustomPromptTemplate(
                    template=self.prompt.template,
                    tools=self._get_tool(),
                    input_variables=self.prompt.input_variables,
                )
            else:
                prompt = PromptTemplate(
                    input_variables=self.prompt.input_variables,
                    template=self.prompt.template,
                )

            return prompt

        else:
            if self.tool:
                return CustomPromptTemplate(
                    template=agent_template,
                    tools=self._get_tool(),
                    input_variables=[
                        "human_input",
                        "intermediate_steps",
                        "chat_history",
                    ],
                )
            return default_chat_prompt

    def _get_llm(self) -> Any:
        if self.llm["provider"] == "openai-chat":
            return (
                ChatOpenAI(
                    temperature=0,
                    openai_api_key=self._get_api_key(),
                    model_name=self.llm["model"],
                    streaming=self.has_streaming,
                    callbacks=[
                        StreamingCallbackHandler(
                            on_llm_new_token_=self.on_llm_new_token,
                            on_llm_end_=self.on_llm_end,
                            on_chain_end_=self.on_chain_end,
                        )
                    ],
                )
                if self.has_streaming
                else ChatOpenAI(model_name=self.llm["model"])
            )

        if self.llm["provider"] == "openai":
            return OpenAI(
                model_name=self.llm["model"], openai_api_key=self._get_api_key()
            )

        if self.llm["provider"] == "anthropic":
            return (
                ChatAnthropic(
                    streaming=self.has_streaming,
                    anthropic_api_key=self._get_api_key(),
                    callbacks=[
                        StreamingCallbackHandler(
                            on_llm_new_token_=self.on_llm_new_token,
                            on_llm_end_=self.on_llm_end,
                            on_chain_end_=self.on_chain_end,
                        )
                    ],
                )
                if self.has_streaming
                else ChatAnthropic(anthropic_api_key=self._get_api_key())
            )

        if self.llm["provider"] == "cohere":
            return (
                Cohere(
                    cohere_api_key=self._get_api_key(),
                    model=self.llm["model"],
                    callbacks=[
                        StreamingCallbackHandler(
                            on_llm_new_token_=self.on_llm_new_token,
                            on_llm_end_=self.on_llm_end,
                            on_chain_end_=self.on_chain_end,
                        )
                    ],
                )
                if self.has_streaming
                else Cohere(cohere_api_key=self._get_api_key(), model=self.llm["model"])
            )

        # Use ChatOpenAI as default llm in agents
        return ChatOpenAI(temperature=0, openai_api_key=self._get_api_key())

    def _get_memory(self) -> Any:
        if self.has_memory:
            memories = prisma.agentmemory.find_many(
                where={"agentId": self.id},
                order={"createdAt": "desc"},
                take=5,
            )
            history = ChatMessageHistory()
            [
                history.add_ai_message(memory.message)
                if memory.agent == "AI"
                else history.add_user_message(memory.message)
                for memory in memories
            ]
            memory = ConversationBufferMemory(
                chat_memory=history, memory_key="chat_history"
            )

            return memory

        return None

    def _get_document(self) -> Any:
        if self.document:
            embeddings = OpenAIEmbeddings()
            docsearch = Pinecone.from_existing_index(
                "superagent", embedding=embeddings, namespace=self.document.id
            )

            return docsearch

        return None

    def get_agent(self) -> Any:
        llm = self._get_llm()
        memory = self._get_memory()
        document = self._get_document()
        tools = self._get_tool()

        if self.document:
            if self.document.type != "OPENAPI":
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

            elif self.document.type == "OPENAPI":
                yaml_response = requests.get(self.document.url)
                content = yaml_response.content
                raw_odds_api_spec = yaml.load(content, Loader=yaml.Loader)
                odds_api_spec = reduce_openapi_spec(raw_odds_api_spec)
                requests_wrapper = RequestsWrapper()
                agent = planner.create_openapi_agent(
                    odds_api_spec, requests_wrapper, llm
                )

        elif self.tool:
            output_parser = CustomOutputParser()
            tool_names = [tool.name for tool in tools]
            llm_chain = LLMChain(llm=llm, prompt=self._get_prompt())
            agent_config = LLMSingleActionAgent(
                llm_chain=llm_chain,
                output_parser=output_parser,
                stop=["\nObservation:"],
                allowed_tools=tool_names,
            )
            agent = AgentExecutor.from_agent_and_tools(
                agent=agent_config, tools=tools, verbose=True, memory=memory
            )

        else:
            agent = LLMChain(
                llm=llm, memory=memory, verbose=True, prompt=self._get_prompt()
            )

        return agent
