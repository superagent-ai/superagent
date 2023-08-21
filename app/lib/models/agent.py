from typing import List

from pydantic import BaseModel

from app.lib.models.response import Agent as BaseAgent


class Agent(BaseModel):
    name: str
    type: str
    description: str = None
    avatarUrl: str = None
    llm: dict = None
    hasMemory: bool = False
    promptId: str = None


class AgentOutput(BaseModel):
    success: bool
    data: BaseAgent = None


class AgentListOutput(BaseModel):
    success: bool
    data: List[BaseAgent]


class PredictAgent(BaseModel):
    input: dict
    has_streaming: bool = False
    session: str = None


class PredictAgentOutput(BaseModel):
    success: bool
    data: str
    trace: dict
