# flake8: noqa
from enum import Enum
from typing import Any, Optional

from pydantic import BaseModel, Field, validator

from prisma.enums import LLMProvider


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
    superagent: Optional["SuperagentAgentTool"]
    openai_assistant: Optional["OpenAIAgentTool"]
    llm: Optional["LLMAgentTool"]

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
    data: Optional[Data] = Field(description="Deprecated! Use `superrag` instead.")
    superrag: Optional[Superrag]


class LLMAgent(Assistant):
    tools: Optional[Tools]
    superrag: Optional[Superrag]


class OpenAIAgent(Assistant):
    pass


class BaseAgentToolModel(BaseModel):
    use_for: str


class SuperagentAgentTool(BaseAgentToolModel, SuperagentAgent):
    pass


class OpenAIAgentTool(BaseAgentToolModel, OpenAIAgent):
    pass


class LLMAgentTool(BaseAgentToolModel, LLMAgent):
    pass


# This is for the circular reference between Agent, Assistant and ToolModel
# for assistant as tools
ToolModel.update_forward_refs()

SAML_OSS_LLM_PROVIDERS = [
    LLMProvider.PERPLEXITY.value,
    LLMProvider.TOGETHER_AI.value,
]


class Workflow(BaseModel):
    superagent: Optional[SuperagentAgent]
    openai_assistant: Optional[OpenAIAgent]
    # ~~OSS LLM providers~~
    perplexity: Optional[LLMAgent]
    together_ai: Optional[LLMAgent]
    llm: Optional[LLMAgent] = Field(
        description="Deprecated! Use LLM providers instead. e.g. `perplexity` or `together_ai`"
    )


class WorkflowConfigModel(BaseModel):
    workflows: list[Workflow] = Field(..., min_items=1)

    class Config:
        @staticmethod
        def schema_extra(schema: dict[str, Any]) -> None:
            schema.pop("title", None)
            for prop in schema.get("properties", {}).values():
                prop.pop("title", None)
