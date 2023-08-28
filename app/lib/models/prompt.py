from typing import List

from pydantic import BaseModel

from app.lib.models.response import Prompt as BasePrompt


class Prompt(BaseModel):
    name: str
    input_variables: list
    template: str


class PromptOutput(BaseModel):
    success: bool
    data: BasePrompt = None


class PromptListOutput(BaseModel):
    success: bool
    data: List[BasePrompt]
