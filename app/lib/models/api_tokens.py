from pydantic import BaseModel


class ApiToken(BaseModel):
    description: str
