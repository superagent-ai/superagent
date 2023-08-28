from pydantic import BaseModel, Field


class DatasourceInput(BaseModel):
    question: str
