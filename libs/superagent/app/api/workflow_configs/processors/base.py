from abc import ABC, abstractmethod

from app.api.workflow_configs.api.api_manager import ApiManager
from app.models.request import AgentUpdate as AgentUpdateRequest


class BaseProcessor(ABC):
    def __init__(
        self,
        assistant: AgentUpdateRequest,
        api_manager: ApiManager,
    ):
        self.assistant = assistant
        self.api_manager = api_manager

    @abstractmethod
    async def process(self, old_data, new_data):
        pass
