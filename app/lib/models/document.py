from pydantic import BaseModel, Field


class Document(BaseModel):
    type: str
    url: str
    name: str
    authorization: dict = None
    from_page: int = (1,)
    to_page: int = None
    splitter: dict = None


class DocumentInput(BaseModel):
    question: str = Field
