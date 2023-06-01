from pydantic import BaseModel


class Tool(BaseModel):
    name: str
    type: str
