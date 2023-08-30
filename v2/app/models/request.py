from typing import Dict, Optional

from pydantic import BaseModel


class Agent(BaseModel):
    isActive: bool = True
    name: str


class AgentLLM(BaseModel):
    llmId: str


class AgentDatasource(BaseModel):
    datasourceId: str


class AgentInvoke(BaseModel):
    input: str
    sessionId: Optional[str]
    enableStreaming: bool


class Datasource(BaseModel):
    name: str
    description: str
    type: str
    url: Optional[str]


class LLM(BaseModel):
    provider: str
    model: str
    apiKey: str
    options: Optional[Dict]
