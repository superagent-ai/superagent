from typing import Any, Optional, Union

from pydantic import BaseModel


class WorkflowDatasource(BaseModel):
    use_for: Optional[str]  # an alias for description
    urls: Optional[list[str]]


class WorkflowSuperRag(WorkflowDatasource):
    database_provider: Optional[str]  # for superrag
    encoder: Optional[str]  # for superrag
    name: Optional[str]  # for superrag


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
