from typing import List, Optional

from pydantic import BaseModel
from prisma.models import (
    Agent as AgentModel,
    ApiUser as ApiUserModel,
    AgentDatasource as AgentDatasourceModel,
    AgentTool as AgentToolModel,
    Datasource as DatasourceModel,
    Tool as ToolModel,
    LLM as LLMModel,
    Workflow as WorkflowModel,
)


class ApiUser(BaseModel):
    success: bool
    data: Optional[ApiUserModel]


class Agent(BaseModel):
    success: bool
    data: Optional[AgentModel]


class AgentDatasource(BaseModel):
    success: bool
    data: Optional[AgentDatasourceModel]


class AgentDatasosurceList(BaseModel):
    success: bool
    data: Optional[List[AgentDatasourceModel]]


class AgentRunList(BaseModel):
    success: bool
    data: Optional[List[dict]]


class AgentTool(BaseModel):
    success: bool
    data: Optional[AgentToolModel]


class AgentToolList(BaseModel):
    success: bool
    data: Optional[List[AgentToolModel]]


class AgentInvoke(BaseModel):
    success: bool
    data: dict


class Datasource(BaseModel):
    success: bool
    data: Optional[DatasourceModel]


class DatasourceList(BaseModel):
    success: bool
    data: Optional[List[DatasourceModel]]


class Tool(BaseModel):
    success: bool
    data: Optional[ToolModel]


class ToolList(BaseModel):
    success: bool
    data: Optional[List[ToolModel]]


class AgentList(BaseModel):
    success: bool
    data: Optional[List[AgentModel]]


class LLM(BaseModel):
    success: bool
    data: Optional[LLMModel]


class LLMList(BaseModel):
    success: bool
    data: Optional[List[LLMModel]]


class Workflow(BaseModel):
    success: bool
    data: Optional[WorkflowModel]


class WorkflowList(BaseModel):
    success: bool
    data: Optional[List[WorkflowModel]]
