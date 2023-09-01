from pydantic import BaseModel, Field


class DatasourceInput(BaseModel):
    question: str


class BingSearchInput(BaseModel):
    search_query: str


class MetaphorSearchInput(BaseModel):
    search_query: str
