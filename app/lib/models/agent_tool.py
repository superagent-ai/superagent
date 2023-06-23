from pydantic import BaseModel


class AgentTool(BaseModel):
    agentId: str
    toolId: str
