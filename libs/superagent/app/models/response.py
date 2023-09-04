from typing import List, Optional

from pydantic import BaseModel


class ApiUser(BaseModel):
    success: bool
    data: Optional[dict]


class Agent(BaseModel):
    success: bool
    data: Optional[dict]


class AgentDatasource(BaseModel):
    success: bool
    data: Optional[dict]


class AgentDatasosurceList(BaseModel):
    success: bool
    data: Optional[List[dict]]


class AgentTool(BaseModel):
    success: bool
    data: Optional[dict]


class AgentToolList(BaseModel):
    success: bool
    data: Optional[List[dict]]


class AgentInvoke(BaseModel):
    success: bool
    data: dict


class Datasource(BaseModel):
    success: bool
    data: Optional[dict]


class DatasourceList(BaseModel):
    success: bool
    data: Optional[List[dict]]


class Tool(BaseModel):
    success: bool
    data: Optional[dict]


class ToolList(BaseModel):
    success: bool
    data: Optional[List[dict]]


class AgentList(BaseModel):
    success: bool
    data: Optional[List[dict]]


class LLM(BaseModel):
    success: bool
    data: Optional[dict]


class LLMList(BaseModel):
    success: bool
    data: Optional[List[dict]]


class Workflow(BaseModel):
    success: bool
    data: Optional[dict]


class WorkflowList(BaseModel):
    success: bool
    data: Optional[List[dict]]
