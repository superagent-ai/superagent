from typing import Any, Dict, Optional

from pydantic import BaseModel


class Agent(BaseModel):
    isActive: bool = True
    name: str
    prompt: str


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
    metadata: Optional[Dict[Any, Any]]


class Tool(BaseModel):
    name: str
    description: str
    type: str
    metadata: Optional[Dict[Any, Any]]


class AgentTool(BaseModel):
    toolId: str


class LLM(BaseModel):
    provider: str
    model: str
    apiKey: str
    options: Optional[Dict]


class Workflow(BaseModel):
    name: str
    description: str


class WorkflowStep(BaseModel):
    order: int
    agentId: str
    input: str
    output: str


class WorkflowInvoke(BaseModel):
    input: str
    enableStreaming: bool
