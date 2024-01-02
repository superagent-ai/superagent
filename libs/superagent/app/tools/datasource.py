# flake8: noqa
import requests
import pandas as pd

from io import StringIO
from decouple import config
from tempfile import NamedTemporaryFile
from langchain.tools import BaseTool
from llama import Context, LLMEngine, Type
from app.vectorstores.base import VectorStoreBase
from app.datasource.loader import DataLoader
from prisma.models import Datasource

from langchain.agents.agent_types import AgentType
from langchain_experimental.agents.agent_toolkits import create_pandas_dataframe_agent
from langchain.chat_models.openai import ChatOpenAI


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
        vector_store = VectorStoreBase(
            options=self.metadata["options"],
            vector_db_provider=self.metadata["provider"],
        )
        result = vector_store.query_documents(
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
        vector_store = VectorStoreBase(
            options=self.metadata["options"],
            vector_db_provider=self.metadata["provider"],
        )
        result = vector_store.query_documents(
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

    def _load_xlsx_data(self, datasource: Datasource):
        with NamedTemporaryFile(suffix=".xlsx", delete=True) as temp_file:
            if datasource.url:
                response = requests.get(datasource.url)
                temp_file.write(response.content)
            else:
                temp_file.write(datasource.content)
            temp_file.flush()
            df = pd.read_excel(temp_file.name, engine="openpyxl")
        return df

    def _load_csv_data(self, datasource: Datasource):
        if datasource.url:
            response = requests.get(datasource.url)
            file_content = StringIO(response.text)
        else:
            file_content = StringIO(datasource.content)
        df = pd.read_csv(file_content)
        return df

    def _run(
        self,
        question: str,
    ) -> str:
        """Use the tool."""
        datasource: Datasource = self.metadata["datasource"]
        if datasource.type == "CSV":
            df = self._load_csv_data(datasource)
        elif datasource.type == "XLSX":
            df = self._load_xlsx_data(datasource)
        else:
            data = DataLoader(datasource=datasource).load()
            df = pd.DataFrame(data)
        agent = create_pandas_dataframe_agent(
            ChatOpenAI(
                temperature=0,
                model="gpt-4-0613",
                openai_api_key=config("OPENAI_API_KEY"),
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
        if datasource.type == "CSV":
            df = self._load_csv_data(datasource)
        elif datasource.type == "XLSX":
            df = self._load_xlsx_data(datasource)
        else:
            data = DataLoader(datasource=datasource).load()
            df = pd.DataFrame(data)
        agent = create_pandas_dataframe_agent(
            ChatOpenAI(
                temperature=0,
                model="gpt-4-0613",
                openai_api_key=config("OPENAI_API_KEY"),
            ),
            df,
            verbose=True,
            agent_type=AgentType.OPENAI_FUNCTIONS,
        )
        output = await agent.arun(question)
        return output
