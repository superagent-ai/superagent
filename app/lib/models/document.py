from pydantic import BaseModel, Field


class Document(BaseModel):
    type: str
    url: str = None
    name: str
    authorization: dict = None
    metadata: dict = None
    from_page: int = (1,)
    to_page: int = None
    splitter: dict = None


class DocumentInput(BaseModel):
    question: str = Field()
