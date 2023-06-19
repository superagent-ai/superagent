import json
from typing import Any

from decouple import config
from langchain import HuggingFaceHub
from langchain.agents import Tool
from langchain.chains import RetrievalQA
from langchain.chat_models import AzureChatOpenAI, ChatAnthropic, ChatOpenAI
from langchain.llms import Cohere, OpenAI
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.memory import ChatMessageHistory, ConversationBufferMemory
from langchain.prompts.prompt import PromptTemplate

from app.lib.callbacks import StreamingCallbackHandler
from app.lib.prisma import prisma
from app.lib.prompts import (
    CustomPromptTemplate,
    agent_template,
    default_chat_prompt,
    qa_prompt,
)
from app.lib.tools import get_search_tool, get_wolfram_alpha_tool, ToolDescription
from app.lib.models.document import DocumentInput
from app.lib.models.tool import ToolInput
from app.lib.vectorstores.base import VectorStoreBase


class AgentBase:
    def __init__(
        self,
        agent: dict,
        has_streaming: bool = False,
        on_llm_new_token=None,
        on_llm_end=None,
        on_chain_end=None,
    ):
        self.id = agent.id
        self.userId = agent.userId
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
        self.documents = self._get_documents()
        self.tools = self._get_tools()

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

        if self.llm["provider"] == "azure-openai":
            return (
                self.llm["api_key"]
                if "api_key" in self.llm
                else config("AZURE_API_KEY")
            )

        if self.llm["provider"] == "huggingface":
            return (
                self.llm["api_key"]
                if "api_key" in self.llm
                else config("HUGGINGFACEHUB_API_TOKEN")
            )

    def _get_tool(self) -> Any:
        try:
            if self.tool.type == "SEARCH":
                tools = get_search_tool()

            if self.tool.type == "WOLFRAM_ALPHA":
                tools = get_wolfram_alpha_tool()

            return tools

        except Exception:
            return None

    def _get_prompt(self, tools: list) -> Any:
        if self.prompt:
            if self.tool or self.documents:
                prompt = CustomPromptTemplate(
                    template=self.prompt.template,
                    tools=tools or self._get_tool(),
                    input_variables=[
                        "human_input",
                        "intermediate_steps",
                        "chat_history",
                    ],
                )
            else:
                prompt = PromptTemplate(
                    input_variables=self.prompt.input_variables,
                    template=self.prompt.template,
                )

            return prompt

        else:
            if self.tool or self.documents:
                return CustomPromptTemplate(
                    template=agent_template,
                    tools=tools or self._get_tool(),
                    input_variables=[
                        "human_input",
                        "intermediate_steps",
                        "chat_history",
                    ],
                )
            elif self.documents:
                return qa_prompt

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

        if self.llm["provider"] == "azure-openai":
            return (
                AzureChatOpenAI(
                    openai_api_key=self._get_api_key(),
                    openai_api_base=config("AZURE_API_BASE"),
                    openai_api_type=config("AZURE_API_TYPE"),
                    openai_api_version=config("AZURE_API_VERSION"),
                    deployment_name=self.llm["model"],
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
                else AzureChatOpenAI(
                    deployment_name=self.llm["model"],
                    openai_api_key=self._get_api_key(),
                    openai_api_base=config("AZURE_API_BASE"),
                    openai_api_type=config("AZURE_API_TYPE"),
                    openai_api_version=config("AZURE_API_VERSION"),
                )
            )

        if self.llm["provider"] == "huggingface":
            return HuggingFaceHub(
                repo_id=self.llm["model"], huggingfacehub_api_token=self._get_api_key()
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

            memory_key = "chat_history"
            output_key = "output"
            memory = (
                ConversationBufferMemory(
                    chat_memory=history, memory_key=memory_key, output_key=output_key
                )
                if (self.document and self.document.type == "OPENAPI")
                or self.documents
                or self.tool
                else ConversationBufferMemory(
                    chat_memory=history, memory_key=memory_key
                )
            )

            return memory

        return None

    def _get_documents(self) -> Any:
        agent_documents = prisma.agentdocument.find_many(
            where={"agentId": self.id}, include={"document": True}
        )

        return agent_documents

    def _get_tool_by_name(self, name: str) -> Any:
        if name == "SEARCH":
            return get_search_tool
        if name == "WOLFRAM_ALPHA":
            return get_wolfram_alpha_tool

    def _get_tools(self) -> list:
        tools = []
        embeddings = OpenAIEmbeddings()

        for agent_document in self.documents:
            description = (
                f"useful when you want to answer questions about {agent_document.document.name}"
                if self.type == "OPENAI"
                else None
            )
            args_schema = DocumentInput if self.type == "OPENAI" else None
            tools.append(
                Tool(
                    name=agent_document.document.id,
                    description=description,
                    args_schema=args_schema,
                    func=RetrievalQA.from_chain_type(
                        llm=self._get_llm(),
                        chain_type="stuff",
                        retriever=(
                            VectorStoreBase()
                            .get_database()
                            .from_existing_index(embeddings, agent_document.document.id)
                        ).as_retriever(),
                    ),
                )
            )

        for agent_tool in self.tools:
            args_schema = ToolInput if self.type == "OPENAI" else None
            tool = self._get_tool_from_name(name=agent_tool.tool.name)
            tools.append(
                Tool(
                    name=agent_tool.tool.name,
                    description=ToolDescription["SEARCH"].value,
                    args_schema=args_schema,
                    func=tool.run,
                )
            )

        return tools

    def _get_agent_tools(self) -> Any:
        tools = prisma.agenttool.find_many(
            where={"agentId": self.id}, include={"tool": True}
        )

        return tools

    def save_intermediate_steps(self, trace: Any) -> None:
        if (
            (self.document and self.document.type == "OPENAPI")
            or self.documents
            or self.tool
        ):
            json_array = json.dumps(
                {
                    "output": trace.get("output") or trace.get("result"),
                    "steps": [
                        {
                            "action": step[0].tool,
                            "input": step[0].tool_input,
                            "log": step[0].log,
                            "observation": step[1],
                        }
                        for step in trace["intermediate_steps"]
                    ],
                }
            )

        else:
            json_array = json.dumps(
                {
                    "output": trace.get("output") or trace.get("result"),
                    "steps": [trace],
                }
            )

        prisma.agenttrace.create(
            {
                "userId": self.userId,
                "agentId": self.id,
                "data": json_array,
            }
        )

    def get_agent(self) -> Any:
        pass
