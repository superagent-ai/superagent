from pydantic import BaseModel


class Agent(BaseModel):
    name: str
    type: str
    llm: dict = None
    has_memory: bool = False


class PredictAgent(BaseModel):
    input: dict
    has_streaming: bool = False
