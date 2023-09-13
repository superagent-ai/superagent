from typing import List

from pydantic import BaseModel, Field

from app.lib.models.response import Document as BaseDocument


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


class DocumentOuput(BaseModel):
    success: bool
    data: BaseDocument = None


class DocumentListOutput(BaseModel):
    success: bool
    data: List[BaseDocument]
