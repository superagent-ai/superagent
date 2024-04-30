from abc import ABC, abstractmethod
from typing import List

from app.memory.memory_stores.base import BaseMemoryStore
from app.memory.message import BaseMessage


class BaseMemory(ABC):
    memory_store: BaseMemoryStore

    @abstractmethod
    def add_message(self, message: BaseMessage) -> None:
        ...

    @abstractmethod
    async def aadd_message(self, message: BaseMessage) -> None:
        ...

    @abstractmethod
    def get_messages(self) -> List[BaseMessage]:
        """
        List all the messages stored in the memory.
        Messages are returned in the descending order of their creation.
        """
        ...

    @abstractmethod
    def clear(self) -> None:
        ...
