# flake8: noqa
import pandas as pd
import tempfile
import os

from decouple import config
from langchain.tools import BaseTool
from llama import Context, LLMEngine, Type
from app.vectorstores.pinecone import PineconeVectorStore
from prisma.models import Datasource

from langchain.agents.agent_types import AgentType
from langchain.agents import create_pandas_dataframe_agent
from langchain.chat_models.openai import ChatOpenAI


class DatasourceFinetuneTool(BaseTool):
    name = "datasource"
    description = "useful for when you need to answer questions"

    def _run(
        self,
        question: str,
    ) -> str:
        """Use the tool."""

        class Question(Type):
            question: str = Context("A question")

        class Answer(Type):
            answer: str = Context("An answer to the question")

        llm = LLMEngine(
            id=self.metadata["agent_id"],
            config={"production.key": config("LAMINI_API_KEY")},
            model_name="chat/gpt-3.5-turbo",
        )
        input = Question(question=question)
        output = llm(input=input, output_type=Answer)
        return output.answer

    async def _arun(
        self,
        question: str,
    ) -> str:
        """Use the tool asynchronously."""

        class Question(Type):
            question: str = Context("A question")

        class Answer(Type):
            answer: str = Context("An answer to the question")

        llm = LLMEngine(
            id=self.metadata["agent_id"],
            config={"production.key": config("LAMINI_API_KEY")},
            model_name="chat/gpt-3.5-turbo",
        )
        input = Question(question=question)
        output = llm(input=input, output_type=Answer)
        return output.answer


class DatasourceTool(BaseTool):
    name = "datasource"
    description = "useful for when you need to answer questions"

    def _run(
        self,
        question: str,
    ) -> str:
        """Use the tool."""
        pinecone = PineconeVectorStore()
        result = pinecone.query_documents(
            prompt=question,
            datasource_id=self.metadata["datasource_id"],
            query_type=self.metadata["query_type"],
            top_k=3,
        )
        return result

    async def _arun(
        self,
        question: str,
    ) -> str:
        """Use the tool asynchronously."""
        pinecone = PineconeVectorStore()
        result = pinecone.query_documents(
            prompt=question,
            datasource_id=self.metadata["datasource_id"],
            query_type=self.metadata["query_type"],
            top_k=3,
        )
        return result


class StructuredDatasourceTool(BaseTool):
    name = "structured datasource"
    description = "useful for when need answer questions"

    def _run(
        self,
        question: str,
    ) -> str:
        """Use the tool."""
        datasource: Datasource = self.metadata["datasource"]

        if datasource.type == "CSV":
            df = pd.read_csv(datasource.url)
        agent = create_pandas_dataframe_agent(
            ChatOpenAI(temperature=0, model="gpt-4"),
            df,
            verbose=True,
            agent_type=AgentType.OPENAI_FUNCTIONS,
        )
        output = agent.run(question)
        return output

    async def _arun(
        self,
        question: str,
    ) -> str:
        """Use the tool asynchronously."""
        datasource: Datasource = self.metadata["datasource"]

        if datasource.type == "CSV":
            df = pd.read_csv(datasource.url)
        agent = create_pandas_dataframe_agent(
            ChatOpenAI(temperature=0, model="gpt-4"),
            df,
            verbose=True,
            agent_type=AgentType.OPENAI_FUNCTIONS,
        )
        output = await agent.arun(question)
        return output
