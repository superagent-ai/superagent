from abc import ABC, abstractmethod


class BaseApiAgentManager(ABC):
    """
    Abstract class for managing agents.
    It can be Agent or Agent as a tool
    """

    @abstractmethod
    async def get_assistant(self, assistant: dict):
        pass

    @abstractmethod
    async def get_datasource(self, assistant: dict, datasource: dict):
        pass

    @abstractmethod
    async def get_tool(self, assistant: dict, tool: dict):
        pass

    @abstractmethod
    async def add_assistant(self, data: dict, order: int | None = None):
        pass

    @abstractmethod
    async def create_assistant(self, data: dict):
        pass

    @abstractmethod
    async def delete_assistant(self, assistant: dict):
        pass

    @abstractmethod
    async def update_assistant(self, assistant: dict, data: dict):
        pass


class BaseApiDatasourceManager(ABC):
    """
    Abstract class for managing datasources.
    It can be Naive RAG or Super RAG
    """

    @abstractmethod
    async def add_datasource(self, assistant: dict, data: dict):
        pass

    @abstractmethod
    async def delete_datasource(self, assistant: dict, datasource: dict):
        pass
