from typing import Any

import langchain
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
from langchain.llms import OpenAI
from langchain.memory import ChatMessageHistory, ConversationBufferMemory
from langchain.vectorstores.pinecone import Pinecone

from app.lib.callbacks import StreamingCallbackHandler
from app.lib.prisma import prisma
from app.lib.prompts import default_chat_prompt, openapi_format_instructions

langchain.debug = False


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
        self.prompt = default_chat_prompt
        self.has_streaming = has_streaming
        self.on_llm_new_token = on_llm_new_token
        self.on_llm_end = on_llm_end
        self.on_chain_end = on_chain_end

    async def _get_api_key(self) -> str:
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

    async def _get_llm(self) -> Any:
        if self.llm["provider"] == "openai-chat":
            return (
                ChatOpenAI(
                    openai_api_key=await self._get_api_key(),
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
                model_name=self.llm["model"], openai_api_key=await self._get_api_key()
            )

        if self.llm["provider"] == "anthropic":
            return (
                ChatAnthropic(
                    streaming=self.has_streaming,
                    anthropic_api_key=await self._get_api_key(),
                )
                if self.has_streaming
                else ChatAnthropic(anthropic_api_key=await self._get_api_key())
            )

        # Use ChatOpenAI as default llm in agents
        return ChatOpenAI(temperature=0, openai_api_key=await self._get_api_key())

    async def _get_memory(self) -> Any:
        if self.has_memory:
            memories = await prisma.agentmemory.find_many(
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

    async def _get_document(self) -> Any:
        if self.document:
            embeddings = OpenAIEmbeddings()
            docsearch = Pinecone.from_existing_index(
                "superagent", embedding=embeddings, namespace=self.document.id
            )

            return docsearch

        return None

    async def get_agent(self) -> Any:
        llm = await self._get_llm()
        memory = await self._get_memory()
        document = await self._get_document()

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
            openapi_toolkit = NLAToolkit.from_llm_and_url(llm, self.document.url)
            tools = openapi_toolkit.get_tools()
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
            agent = LLMChain(llm=llm, memory=memory, verbose=True, prompt=self.prompt)

        return agent
