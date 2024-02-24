from enum import Enum
from typing import Any, Generic, Optional, TypeVar

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
        description="The encoder to use for the index"
    )
    database_provider: Optional[SuperragDatabaseProvider] = Field(
        description="The vector database provider to use for the index"
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
    superagent: Optional["BaseAssistantToolModel[SuperagentAgent]"]
    openai_assistant: Optional["BaseAssistantToolModel[OpenAIAgent]"]
    llm: Optional["BaseAssistantToolModel[LLMAgent]"]

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


# ~~~Agents~~~
class SuperagentAgent(Assistant):
    tools: Optional[Tools]
    data: Optional[Data]  # deprecated, use superrag instead
    superrag: Optional[Superrag]


class LLMAgent(Assistant):
    tools: Optional[Tools]
    superrag: Optional[Superrag]


class OpenAIAgent(Assistant):
    pass


AgentT = TypeVar("AgentT")


class BaseAssistantToolModel(BaseModel, Generic[AgentT]):
    use_for: str


# This is for the circular reference between Agent, Assistant and ToolModel
# for assistant as tools
ToolModel.update_forward_refs()


class Workflow(BaseModel):
    superagent: Optional[SuperagentAgent]
    openai_assistant: Optional[OpenAIAgent]
    llm: Optional[LLMAgent]


class WorkflowConfigModel(BaseModel):
    workflows: list[Workflow] = Field(..., min_items=1)

    class Config:
        @staticmethod
        def schema_extra(schema: dict[str, Any]) -> None:
            schema.pop("title", None)
            for prop in schema.get("properties", {}).values():
                prop.pop("title", None)
