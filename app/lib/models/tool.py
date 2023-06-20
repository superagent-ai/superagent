from pydantic import BaseModel, Field


class Tool(BaseModel):
    name: str
    type: str
    authorization: dict = None


class SearchToolInput(BaseModel):
    input: str = Field()


class WolframToolInput(BaseModel):
    question: str = Field()
