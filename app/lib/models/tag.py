from typing import List

from pydantic import BaseModel

from app.lib.models.response import Tag as BaseTag


class Tag(BaseModel):
    name: str
    color: str


class TagOutput(BaseModel):
    success: bool
    data: BaseTag = None


class TagListOutput(BaseModel):
    success: bool
    data: List[BaseTag]
