from typing import Any, Dict, Optional

from pydantic import BaseModel

from prisma.enums import LLMProvider, VectorDbProvider


class ApiUser(BaseModel):
    email: str


class Agent(BaseModel):
    isActive: bool = True
    name: str
    type: Optional[str] = "SUPERAGENT"
    initialMessage: Optional[str]
    prompt: Optional[str]
    llmModel: Optional[str]
    llmProvider: Optional[LLMProvider]
    description: Optional[str]
    avatar: Optional[str]
    openaiOptions: Optional[Dict[str, Any]]


class AgentUpdate(BaseModel):
    isActive: Optional[bool]
    name: Optional[str]
    initialMessage: Optional[str]
    prompt: Optional[str]
    llmModel: Optional[str]
    description: Optional[str]
    avatar: Optional[str]
    type: Optional[str]
    openaiOptions: Optional[Dict[str, Any]]


class AgentLLM(BaseModel):
    llmId: str


class AgentDatasource(BaseModel):
    datasourceId: str


class LLMParams(BaseModel):
    max_tokens: int
    temperature: float


class AgentInvoke(BaseModel):
    input: str
    sessionId: Optional[str]
    enableStreaming: bool
    outputSchema: Optional[str]
    llm_params: Optional[LLMParams]


class Datasource(BaseModel):
    name: str
    description: str
    type: str
    content: Optional[str]
    url: Optional[str]
    metadata: Optional[Dict[Any, Any]]
    vectorDbId: Optional[str]


class Tool(BaseModel):
    name: str
    description: Optional[str] = "An helpful tool."
    type: str
    metadata: Optional[Dict[Any, Any]]
    returnDirect: Optional[bool] = False


class AgentTool(BaseModel):
    toolId: str


class LLM(BaseModel):
    provider: str
    apiKey: str
    options: Optional[Dict]


class Workflow(BaseModel):
    name: str
    description: str


class WorkflowStep(BaseModel):
    order: int
    agentId: str


class WorkflowInvoke(BaseModel):
    input: str
    enableStreaming: bool
    sessionId: Optional[str]


class VectorDb(BaseModel):
    provider: VectorDbProvider
    options: Dict


class WorkflowConfig(BaseModel):
    name: str
    description: Optional[str]
