from pydantic import BaseModel


class Tag(BaseModel):
    name: str
    color: str
