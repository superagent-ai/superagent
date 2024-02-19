from typing import Any, Optional, Union

from pydantic import BaseModel, validator


class WorkflowDatasource(BaseModel):
    use_for: Optional[str]  # an alias for description
    urls: Optional[list[str]]


class WorkflowSuperRagEncoder(BaseModel):
    type: str
    name: str
    dimensions: int


class WorkflowSuperRag(WorkflowDatasource):
    database_provider: Optional[str]
    encoder: Optional[WorkflowSuperRagEncoder]
    name: Optional[str]

    @validator("name")
    def name_too_long(v):
        MAX_LENGTH = 24
        if len(v) > MAX_LENGTH:
            raise ValueError(
                f'SuperRag\'s "name" field should be less than {MAX_LENGTH} characters'
            )
        return v


class WorkflowTool(BaseModel):
    name: str
    use_for: str  # an alias for description
    metadata: Optional[dict[Any, Any]]


class WorkflowAssistant(BaseModel):
    name: str
    llm: str  # an alias for llmModel
    prompt: str
    intro: Optional[str]  # an alias for initialMessage

    tools: Optional[list[dict[str, WorkflowTool]]]
    data: Optional[WorkflowDatasource]
    superrag: Optional[list[dict[str, WorkflowSuperRag]]]


class WorkflowAssistantAsTool(WorkflowAssistant):
    use_for: str  # an alias for description


class NestedWorkflowAssistant(WorkflowAssistant):
    tools: Optional[list[dict[str, Union[WorkflowAssistantAsTool, WorkflowTool]]]]


class WorkflowConfig(BaseModel):
    workflows: list[dict[str, NestedWorkflowAssistant]]
