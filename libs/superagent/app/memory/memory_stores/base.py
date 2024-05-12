from abc import ABC, abstractmethod
from typing import List

from app.memory.message import BaseMessage


class BaseMemoryStore(ABC):
    @abstractmethod
    def get_messages(self) -> List[BaseMessage]:
        ...  # noqa

    @abstractmethod
    def add_message(self, value: BaseMessage):
        ...  # noqa

    @abstractmethod
    async def aadd_message(self, value: BaseMessage):
        ...  # noqa

    @abstractmethod
    def clear(self):
        ...
