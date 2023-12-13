# flake8: noqa
from pydantic import BaseModel, Field
from app.tools.base import BaseTool
from app.vectorstores.base import VectorStoreBase


class NoopArgs(BaseModel):
    answer: str = Field(..., description="Answer to users question")


class NoopTool(BaseTool):
    args_schema = NoopArgs

    async def arun(self, args: NoopArgs) -> dict:
        answer = args["answer"]
        return {"type": "assistant", "content": answer}
