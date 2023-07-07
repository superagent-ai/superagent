from pydantic import BaseModel, Field


class Tool(BaseModel):
    name: str
    type: str
    description: str
    authorization: dict = None
    metadata: dict = None


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


class OpenApiToolInput(BaseModel):
    input: str = Field()
