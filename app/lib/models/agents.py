from pydantic import BaseModel


class Agent(BaseModel):
    name: str
    type: str
