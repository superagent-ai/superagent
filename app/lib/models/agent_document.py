from pydantic import BaseModel


class AgentDocument(BaseModel):
    agentId: str
    documentId: str
