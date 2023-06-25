from pydantic import BaseModel


class Agent(BaseModel):
    name: str
    type: str
    llm: dict = None
    hasMemory: bool = False
    promptId: str = None


class PredictAgent(BaseModel):
    input: dict
    has_streaming: bool = False
