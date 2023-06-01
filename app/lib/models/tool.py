from pydantic import BaseModel


class Tool(BaseModel):
    name: str
    type: str
    authorization: dict = None
