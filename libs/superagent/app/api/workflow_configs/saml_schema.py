from typing import Any, Dict, List, Optional, Union

from pydantic import BaseModel


class WorkflowDatasource(BaseModel):
    use_for: Optional[str]  # an alias for description
    urls: Optional[List[str]]
    database_provider: Optional[str]  # for superrag
    encoder: Optional[str]  # for superrag


class WorkflowTool(BaseModel):
    name: str
    use_for: str  # an alias for description
    metadata: Optional[Dict[Any, Any]]


class WorkflowAssistant(BaseModel):
    name: str
    llm: str  # an alias for llmModel
    prompt: str
    intro: Optional[str]  # an alias for initialMessage

    tools: Optional[List[Dict[str, WorkflowTool]]]
    data: Optional[Dict[str, WorkflowDatasource]]


class WorkflowAssistantAsTool(WorkflowAssistant):
    use_for: str  # an alias for description


class NestedWorkflowAssistant(WorkflowAssistant):
    tools: Optional[List[Dict[str, Union[WorkflowAssistantAsTool, WorkflowTool]]]]


class WorkflowConfig(BaseModel):
    workflows: List[Dict[str, NestedWorkflowAssistant]]
