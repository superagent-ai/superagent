# flake8: noqa
from pydantic import BaseModel, Field
from app.tools.base import BaseTool
from app.vectorstores.base import VectorStoreBase


class UstructuredDatasourceArgs(BaseModel):
    question: str = Field(..., description="The question to answer")


class UnstructuredDataSourceTool(BaseTool):
    args_schema = UstructuredDatasourceArgs

    async def arun(self, args: UstructuredDatasourceArgs) -> dict:
        question = args["question"]
        vector_store = VectorStoreBase()
        result = vector_store.query_documents(
            prompt=question,
            datasource_id=self.metadata.get("datasource_id"),
            query_type="document",
            top_k=3,
        )
        return {"type": "function_call", "content": result}
