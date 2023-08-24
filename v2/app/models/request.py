from pydantic import BaseModel
from typing import Optional, Dict


class Agent(BaseModel):
    isActive: bool = True
    name: str


class AgentLLM(BaseModel):
    llmId: str


class LLM(BaseModel):
    provider: str
    model: str
    apiKey: str
    options: Optional[Dict]
