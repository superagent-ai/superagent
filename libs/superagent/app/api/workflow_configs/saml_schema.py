from enum import Enum
from typing import Any, Optional

from pydantic import BaseModel, Field, validator


class SuperragEncoderType(str, Enum):
    openai = "openai"


class SuperragEncoder(BaseModel):
    type: SuperragEncoderType
    name: str
    dimensions: int


class SuperragDatabaseProvider(str, Enum):
    pinecone = "pinecone"
    weaviate = "weaviate"
    qdrant = "qdrant"


class SuperragIndex(BaseModel):
    name: str
    urls: list[str]
    use_for: str
    encoder: Optional[SuperragEncoder] = Field(
        ..., description="The encoder to use for the index"
    )
    database_provider: Optional[SuperragDatabaseProvider] = Field(
        ..., description="The vector database provider to use for the index"
    )

    @validator("name")
    def name_too_long(v):
        MAX_LENGTH = 24
        if len(v) > MAX_LENGTH:
            raise ValueError(
                f'SuperRag\'s "name" field should be less than {MAX_LENGTH} characters'
            )
        return v


class SuperragItem(BaseModel):
    index: Optional[SuperragIndex]


class Superrag(BaseModel):
    __root__: list[SuperragItem]


class Data(BaseModel):
    urls: list[str]
    use_for: str


class Tool(BaseModel):
    name: str
    use_for: str
    metadata: Optional[dict[str, Any]]


class ToolModel(BaseModel):
    # ~~~~~~Superagent tools~~~~~~
    browser: Optional[Tool]
    code_executor: Optional[Tool]
    hand_off: Optional[Tool]
    http: Optional[Tool]
    bing_search: Optional[Tool]
    replicate: Optional[Tool]
    algolia: Optional[Tool]
    metaphor: Optional[Tool]
    function: Optional[Tool]
    # ~~~~~~Assistants as tools~~~~~~
    superagent: Optional["AgentTool"]
    openai_assistant: Optional["AgentTool"]
    llm: Optional["AssistantTool"]

    # OpenAI Assistant tools
    code_interpreter: Optional[Tool]
    retrieval: Optional[Tool]


class Tools(BaseModel):
    __root__: list[ToolModel]


class Assistant(BaseModel):
    name: str
    llm: str
    prompt: str
    intro: Optional[str]


class Agent(Assistant):
    tools: Optional[Tools]
    data: Optional[Data]
    superrag: Optional[Superrag]


class BaseAssistantToolModel(BaseModel):
    use_for: str


class AgentTool(BaseAssistantToolModel, Agent):
    pass


class AssistantTool(BaseAssistantToolModel, Assistant):
    pass


# This is for the circular reference between Agent, Assistant and ToolModel
# for assistant as tools
ToolModel.update_forward_refs()


class Workflow(BaseModel):
    superagent: Optional[Agent]
    openai_assistant: Optional[Assistant]
    llm: Optional[Assistant]


class WorkflowConfigModel(BaseModel):
    workflows: list[Workflow] = Field(..., min_items=1)

    class Config:
        @staticmethod
        def schema_extra(schema: dict[str, Any]) -> None:
            schema.pop("title", None)
            for prop in schema.get("properties", {}).values():
                prop.pop("title", None)
