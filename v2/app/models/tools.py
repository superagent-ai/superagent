from pydantic import BaseModel, Field


class DatasourceInput(BaseModel):
    question: str


class BingSearchInput(BaseModel):
    search_query: str


class MetaphorSearchInput(BaseModel):
    search_query: str


class PubMedInput(BaseModel):
    search_query: str


class ZapierInput(BaseModel):
    input: str


class OpenapiInput(BaseModel):
    input: str


class ChatGPTInput(BaseModel):
    input: str
