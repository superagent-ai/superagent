from typing import Any

from pydantic import BaseModel


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


class ReplicateInput(BaseModel):
    prompt: str


class AgentInput(BaseModel):
    input: Any


class WolframInput(BaseModel):
    input: str


class E2BCodeExecutorInput(BaseModel):
    python_code: str


class BrowserInput(BaseModel):
    url: str
