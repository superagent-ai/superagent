from pydantic import BaseModel
from typing import Optional, Dict


class Agent(BaseModel):
    isActive: bool = True
    llmId: str
    name: str


class LLM(BaseModel):
    provider: str
    model: str
    apiKey: str
    options: Optional[Dict]
