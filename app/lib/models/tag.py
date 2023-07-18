from pydantic import BaseModel, Field

class Tag(BaseModel):
    name: str
    color: str
    