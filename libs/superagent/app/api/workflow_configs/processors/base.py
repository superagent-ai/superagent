from abc import ABC, abstractmethod

from app.api.workflow_configs.api.api_manager import ApiManager


class BaseProcessor(ABC):
    def __init__(
        self,
        assistant: dict,
        api_manager: ApiManager,
        api_user,
    ):
        self.assistant = assistant
        self.api_manager = api_manager
        self.api_user = api_user

    @abstractmethod
    async def process(self, old_data, new_data):
        pass
