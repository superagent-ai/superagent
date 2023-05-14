from pydantic import BaseModel


class Document(BaseModel):
    name: str
    type: str
    url: str
