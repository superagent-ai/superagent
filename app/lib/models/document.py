from pydantic import BaseModel


class Document(BaseModel):
    type: str
    url: str
