from typing import Any, Dict, List, Optional

from openai.types.beta.assistant_create_params import Tool as OpenAiAssistantTool
from pydantic import BaseModel

from prisma.enums import AgentType, LLMProvider, VectorDbProvider


class ApiUser(BaseModel):
    email: str
    firstName: Optional[str]
    lastName: Optional[str]
    company: Optional[str]
    anonymousId: Optional[str]


class ApiKey(BaseModel):
    name: str


class OpenAiAssistantParameters(BaseModel):
    metadata: Optional[Dict[str, Any]]
    fileIds: Optional[List[str]]
    tools: Optional[List[OpenAiAssistantTool]]


class Agent(BaseModel):
    isActive: Optional[bool] = True
    name: str
    initialMessage: Optional[str]
    prompt: Optional[str]
    llmModel: Optional[str]
    llmProvider: Optional[LLMProvider]
    description: Optional[str] = "An helpful agent."
    avatar: Optional[str]
    type: Optional[AgentType] = AgentType.SUPERAGENT
    parameters: Optional[OpenAiAssistantParameters]
    metadata: Optional[dict]


class AgentUpdate(BaseModel):
    isActive: Optional[bool]
    name: Optional[str]
    initialMessage: Optional[str]
    prompt: Optional[str]
    llmModel: Optional[str]
    description: Optional[str]
    avatar: Optional[str]
    type: Optional[str]
    metadata: Optional[Dict[str, Any]]


class AgentLLM(BaseModel):
    llmId: str


class AgentDatasource(BaseModel):
    datasourceId: str


class LLMParams(BaseModel):
    max_tokens: Optional[int]
    temperature: Optional[float] = 0.5


class AgentInvoke(BaseModel):
    input: str
    sessionId: Optional[str]
    enableStreaming: bool
    outputSchema: Optional[str]
    llm_params: Optional[LLMParams]


class Datasource(BaseModel):
    name: str
    description: Optional[str]
    type: str
    content: Optional[str]
    url: Optional[str]
    metadata: Optional[Dict[Any, Any]]
    vectorDbId: Optional[str]


class DatasourceUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]
    type: Optional[str]
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


class ToolUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]
    type: Optional[str]
    metadata: Optional[Dict[Any, Any]]
    returnDirect: Optional[bool]


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
