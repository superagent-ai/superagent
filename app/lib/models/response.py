from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel


class AgentType(str, Enum):
    REACT = "REACT"
    PLANSOLVE = "PLANSOLVE"
    OPENAI = "OPENAI"


class AgentMemoryAuthorType(str, Enum):
    HUMAN = "HUMAN"
    AI = "AI"


class DocumentType(str, Enum):
    TXT = "TXT"
    PDF = "PDF"
    CSV = "CSV"
    YOUTUBE = "YOUTUBE"
    OPENAPI = "OPENAPI"
    URL = "URL"
    MARKDOWN = "MARKDOWN"
    FIRESTORE = "FIRESTORE"
    PSYCHIC = "PSYCHIC"
    GITHUB_REPOSITORY = "GITHUB_REPOSITORY"
    WEBPAGE = "WEBPAGE"
    STRIPE = "STRIPE"
    AIRTABLE = "AIRTABLE"
    SITEMAP = "SITEMAP"
    NOTION = "NOTION"


class ToolType(str, Enum):
    BROWSER = "BROWSER"
    SEARCH = "SEARCH"
    WOLFRAM_ALPHA = "WOLFRAM_ALPHA"
    REPLICATE = "REPLICATE"
    ZAPIER_NLA = "ZAPIER_NLA"
    AGENT = "AGENT"
    OPENAPI = "OPENAPI"
    CHATGPT_PLUGIN = "CHATGPT_PLUGIN"
    METAPHOR = "METAPHOR"


# Models
class User(BaseModel):
    id: str
    email: str
    password: Optional[str]
    name: Optional[str]
    createdAt: Optional[datetime]
    updatedAt: Optional[datetime]
    deletedAt: Optional[datetime]
    provider: Optional[str]
    accessToken: Optional[str]


class Profile(BaseModel):
    id: str
    userId: str
    metadata: Optional[dict]


class Document(BaseModel):
    id: str
    description: Optional[str]
    userId: str
    type: DocumentType
    url: Optional[str]
    content: Optional[str]
    contentHash: Optional[str]
    name: str
    splitter: Optional[dict]
    createdAt: Optional[datetime]
    updatedAt: Optional[datetime]
    index: Optional[dict]
    authorization: Optional[dict]
    metadata: Optional[dict]


class Agent(BaseModel):
    id: str
    description: Optional[str]
    avatarUrl: Optional[str]
    shareableToken: Optional[str]
    userId: str
    documentId: Optional[str]
    toolId: Optional[str]
    tags: Optional[List[dict]]
    promptId: Optional[str]
    prompt: Optional[dict]
    name: str
    type: AgentType
    llm: dict
    hasMemory: bool
    isPublic: bool
    isListed: bool
    createdAt: Optional[datetime]
    updatedAt: Optional[datetime]


class ApiToken(BaseModel):
    id: str
    userId: str
    description: str
    token: str


class AgentMemory(BaseModel):
    id: str
    agentId: str
    author: AgentMemoryAuthorType
    message: str
    session: Optional[str]
    createdAt: Optional[datetime]
    updatedAt: Optional[datetime]
    deletedAt: Optional[datetime]


class AgentTrace(BaseModel):
    id: str
    userId: str
    agentId: str
    data: dict
    createdAt: Optional[datetime]
    updatedAt: Optional[datetime]


class Prompt(BaseModel):
    id: str
    name: str
    template: str
    input_variables: list
    userId: str
    createdAt: Optional[datetime]
    updatedAt: Optional[datetime]
    deletedAt: Optional[datetime]


class AgentDocument(BaseModel):
    id: str
    documentId: Optional[str]
    document: Optional[Document]
    agentId: str
    createdAt: Optional[datetime]
    updatedAt: Optional[datetime]
    deletedAt: Optional[datetime]


class Tag(BaseModel):
    id: str
    name: str
    color: Optional[str]
    userId: str
    createdAt: Optional[datetime]
    updatedAt: Optional[datetime]


class Tool(BaseModel):
    id: str
    name: str
    description: Optional[str]
    type: Optional[ToolType]
    metadata: Optional[dict]
    userId: str
    returnDirect: bool
    createdAt: Optional[datetime]
    updatedAt: Optional[datetime]


class AgentTool(BaseModel):
    id: str
    toolId: Optional[str]
    tool: Optional[Tool]
    agentId: str
    createdAt: Optional[datetime]
    updatedAt: Optional[datetime]
    deletedAt: Optional[datetime]
