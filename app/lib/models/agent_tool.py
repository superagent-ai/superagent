from typing import List

from pydantic import BaseModel

from app.lib.models.response import AgentTool as BaseAgentTool


class AgentTool(BaseModel):
    agentId: str
    toolId: str


class AgentToolOutput(BaseModel):
    success: bool
    data: BaseAgentTool = None


class AgentToolListOutput(BaseModel):
    success: bool
    data: List[BaseAgentTool]
