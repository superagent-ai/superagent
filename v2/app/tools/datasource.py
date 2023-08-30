# flake8: noqa
from typing import Optional

from decouple import config
from langchain.tools import BaseTool
from llama import Context, LLMEngine, Type


class DatasourceTool(BaseTool):
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
