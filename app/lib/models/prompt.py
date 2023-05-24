from pydantic import BaseModel


class Prompt(BaseModel):
    name: str
    input_variables: list
    template: str
