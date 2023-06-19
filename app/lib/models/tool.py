from pydantic import BaseModel, Field


class Tool(BaseModel):
    name: str
    type: str
    authorization: dict = None


class ToolInput(BaseModel):
    input: str = Field
