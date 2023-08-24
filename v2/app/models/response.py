from pydantic import BaseModel
from typing import List, Optional
from prisma.models import Agent, LLM


class Agent(BaseModel):
    success: bool
    data: Optional[dict]


class AgentList(BaseModel):
    success: bool
    data: Optional[List[dict]]


class LLM(BaseModel):
    success: bool
    data: Optional[dict]


class LLMList(BaseModel):
    success: bool
    data: Optional[List[dict]]
