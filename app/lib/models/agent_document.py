from typing import List

from pydantic import BaseModel

from app.lib.models.response import AgentDocument as BaseAgentDocument


class AgentDocument(BaseModel):
    agentId: str
    documentId: str


class AgentDocumentOutput(BaseModel):
    success: bool
    data: BaseAgentDocument = None


class AgentDocumentListOuput(BaseModel):
    success: bool
    data: List[BaseAgentDocument]
