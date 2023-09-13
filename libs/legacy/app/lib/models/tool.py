from typing import List

from pydantic import BaseModel, Field

from app.lib.models.response import Tool as BaseTool


class Tool(BaseModel):
    name: str
    type: str
    description: str
    returnDirect: bool = False
    authorization: dict = None
    metadata: dict = None


class ToolOutput(BaseModel):
    success: bool
    data: BaseTool = None


class ToolListOutput(BaseModel):
    success: bool
    data: List[BaseTool]


class SearchToolInput(BaseModel):
    input: str = Field()


class WolframToolInput(BaseModel):
    question: str = Field()


class ReplicateToolInput(BaseModel):
    prompt: str = Field()


class ZapierToolInput(BaseModel):
    input: str = Field()


class AgentToolInput(BaseModel):
    query: str = Field()


class MetaphorToolInput(BaseModel):
    query: str = Field()


class OpenApiToolInput(BaseModel):
    input: str = Field()
