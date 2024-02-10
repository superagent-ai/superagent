from abc import ABC, abstractmethod

from app.models.request import (
    Agent as AgentRequest,
    AgentUpdate as AgentUpdateRequest,
    DatasourceUpdate as DatasourceUpdateRequest,
    ToolUpdate as ToolUpdateRequest,
)


class BaseApiAgentManager(ABC):
    """
    Abstract class for managing agents.
    It can be Agent or Agent as a tool
    """

    @abstractmethod
    async def get_assistant(self, assistant: AgentUpdateRequest):
        pass

    @abstractmethod
    async def get_datasource(
        self, assistant: AgentUpdateRequest, datasource: DatasourceUpdateRequest
    ):
        pass

    @abstractmethod
    async def get_tool(self, assistant: AgentUpdateRequest, tool: ToolUpdateRequest):
        pass

    @abstractmethod
    async def add_assistant(self, data: AgentRequest, order: int | None = None):
        pass

    @abstractmethod
    async def create_assistant(self, data: AgentRequest):
        pass

    @abstractmethod
    async def delete_assistant(self, assistant: AgentUpdateRequest):
        pass

    @abstractmethod
    async def update_assistant(
        self, assistant: AgentUpdateRequest, data: AgentUpdateRequest
    ):
        pass
