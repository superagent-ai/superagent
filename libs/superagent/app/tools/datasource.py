# flake8: noqa
import logging
import pandas as pd

from decouple import config
from langchain.tools import BaseTool
from llama import Context, LLMEngine, Type
from app.vectorstores.pinecone import PineconeVectorStore
from app.datasource.loader import DataLoader
from prisma.models import Datasource

from langchain.agents.agent_types import AgentType
from langchain.agents import create_pandas_dataframe_agent
from langchain.chat_models.openai import ChatOpenAI

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


class DatasourceFinetuneTool(BaseTool):
    name = "datasource"
    description = "useful for when you need to answer questions"
    return_direct = False

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
    return_direct = False

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
    return_direct = False

    def _run(
        self,
        question: str,
    ) -> str:
        """Use the tool."""
        datasource: Datasource = self.metadata["datasource"]
        if datasource.type == "CSV":
            df = pd.read_csv(datasource.url)
        else:
            data = DataLoader(datasource=datasource).load()
            df = pd.DataFrame(data)
        agent = create_pandas_dataframe_agent(
            ChatOpenAI(
                temperature=0, model="gpt-4", openai_api_key=config("OPENAI_API_KEY")
            ),
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
        logging.info(f"Loading datasource {datasource}")
        if datasource.type == "CSV":
            logging.info(f"Loading CSV {datasource.url}")
            df = pd.read_csv(datasource.url)
            logging.info(f"CSV loaded")
        else:
            data = DataLoader(datasource=datasource).load()
            df = pd.DataFrame(data)

        agent = create_pandas_dataframe_agent(
            ChatOpenAI(
                temperature=0, model="gpt-4", openai_api_key=config("OPENAI_API_KEY")
            ),
            df,
            verbose=True,
            agent_type=AgentType.OPENAI_FUNCTIONS,
        )
        logging.info("Agent created")
        output = await agent.arun(question)
        return output
