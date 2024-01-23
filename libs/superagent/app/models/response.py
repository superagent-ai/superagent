from typing import Any, List, Optional

from pydantic import BaseModel

from prisma.models import (
    LLM as LLMModel,
)
from prisma.models import (
    Agent as AgentModel,
)
from prisma.models import (
    AgentDatasource as AgentDatasourceModel,
)
from prisma.models import (
    AgentTool as AgentToolModel,
)
from prisma.models import (
    ApiUser as ApiUserModel,
)
from prisma.models import (
    Datasource as DatasourceModel,
)
from prisma.models import (
    Tool as ToolModel,
)
from prisma.models import (
    VectorDb as VectorDbModel,
)
from prisma.models import (
    Workflow as WorkflowModel,
)
from prisma.models import (
    WorkflowStep as WorkflowStepModel,
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
    data: Any


class Datasource(BaseModel):
    success: bool
    data: Optional[DatasourceModel]


class DatasourceList(BaseModel):
    success: bool
    data: Optional[List[DatasourceModel]]
    total_pages: int


class Tool(BaseModel):
    success: bool
    data: Optional[ToolModel]


class ToolList(BaseModel):
    success: bool
    data: Optional[List[ToolModel]]
    total_pages: int


class AgentList(BaseModel):
    success: bool
    data: Optional[List[AgentModel]]
    total_pages: int


class LLM(BaseModel):
    success: bool
    data: Optional[LLMModel]


class LLMList(BaseModel):
    success: bool
    data: Optional[List[LLMModel]]


class Workflow(BaseModel):
    success: bool
    data: Optional[WorkflowModel]


class WorkflowStep(BaseModel):
    success: bool
    data: Optional[WorkflowStepModel]


class WorkflowList(BaseModel):
    success: bool
    data: Optional[List[WorkflowModel]]
    total_pages: int


class WorkflowStepList(BaseModel):
    success: bool
    data: Optional[List[WorkflowStepModel]]


class VectorDb(BaseModel):
    success: bool
    data: Optional[VectorDbModel]


class VectorDbList(BaseModel):
    success: bool
    data: Optional[List[VectorDbModel]]
