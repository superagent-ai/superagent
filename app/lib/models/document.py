from pydantic import BaseModel, Field


class Document(BaseModel):
    type: str
    url: str | None = None
    description: str | None = None
    content: str | None = None
    name: str
    authorization: dict | None = None
    metadata: dict | None = None
    from_page: int = 1
    to_page: int | None = None
    splitter: dict | None = None


class DocumentInput(BaseModel):
    question: str = Field()
