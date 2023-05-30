from typing import Any

from decouple import config
from langchain.agents import AgentType, initialize_agent
from langchain.agents.agent_toolkits import NLAToolkit
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
from langchain.requests import Requests
from langchain.vectorstores.pinecone import Pinecone

from app.lib.callbacks import StreamingCallbackHandler
from app.lib.prisma import prisma
from app.lib.prompts import default_chat_prompt, openapi_format_instructions


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

    def _get_prompt(self) -> Any:
        if self.prompt:
            prompt = PromptTemplate(
                input_variables=self.prompt.input_variables,
                template=self.prompt.template,
            )

            return prompt

        else:
            return default_chat_prompt

    def _get_llm(self) -> Any:
        if self.llm["provider"] == "openai-chat":
            return (
                ChatOpenAI(
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

        if self.document and self.document.type != "OPENAPI":
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

        elif self.document and self.document.type == "OPENAPI":
            requests = (
                Requests(
                    headers={
                        self.document.authorization["key"]: self.document.authorization[
                            "value"
                        ]
                    }
                )
                if self.document.authorization
                else Requests()
            )
            openapi_toolkit = NLAToolkit.from_llm_and_url(
                llm, self.document.url, requests=requests, max_text_length=1800
            )
            tools = openapi_toolkit.get_tools()[:30]
            mrkl = initialize_agent(
                tools=tools,
                llm=llm,
                agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
                verbose=True,
                max_iterations=1,
                early_stopping_method="generate",
                agent_kwargs={"format_instructions": openapi_format_instructions},
            )

            return mrkl

        else:
            agent = LLMChain(
                llm=llm, memory=memory, verbose=True, prompt=self._get_prompt()
            )

        return agent
