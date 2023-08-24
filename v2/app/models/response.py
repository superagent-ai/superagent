from pydantic import BaseModel
from typing import List, Optional


class ApiUser(BaseModel):
    success: bool
    data: Optional[dict]


class Agent(BaseModel):
    success: bool
    data: Optional[dict]


class Datasource(BaseModel):
    success: bool
    data: Optional[dict]


class DatasourceList(BaseModel):
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
