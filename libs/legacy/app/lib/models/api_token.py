from typing import List

from pydantic import BaseModel

from app.lib.models.response import ApiToken as BaseApiToken


class ApiToken(BaseModel):
    description: str


class ApiTokenOutput(BaseModel):
    success: bool
    data: BaseApiToken = None


class ApiTokenListOutput(BaseModel):
    success: bool
    data: List[BaseApiToken]
