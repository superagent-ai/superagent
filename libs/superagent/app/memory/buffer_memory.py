from typing import Optional

from litellm import model_cost

from app.memory.base import BaseMemory
from app.memory.memory_stores.base import BaseMemoryStore
from app.memory.message import BaseMessage

DEFAULT_TOKEN_LIMIT_RATIO = 0.75
DEFAULT_TOKEN_LIMIT = 3000


class BufferMemory(BaseMemory):
    def __init__(
        self,
        memory_store: BaseMemoryStore,
        tokenizer_fn: callable,
        model: str,
        max_tokens: Optional[int] = None,
    ):
        self.memory_store = memory_store
        self.tokenizer_fn = tokenizer_fn
        self.model = model
        context_window = model_cost.get(self.model, {}).get("max_input_tokens")
        self.context_window = max_tokens or context_window * DEFAULT_TOKEN_LIMIT_RATIO

    def add_message(self, message: BaseMessage) -> None:
        self.memory_store.add_message(message)

    async def aadd_message(self, message: BaseMessage) -> None:
        await self.memory_store.aadd_message(message)

    def get_messages(
        self,
        inital_token_usage: int = 0,
    ) -> list[BaseMessage]:
        messages = self.memory_store.get_messages()

        index = 0
        token_usage = inital_token_usage
        while index < len(messages):
            message = messages[index]
            curr_token_usage = self.tokenizer_fn(text=message.content)
            if token_usage + curr_token_usage > self.context_window:
                break

            token_usage += curr_token_usage
            index += 1

        return messages[:index]

    def clear(self) -> None:
        self.memory_store.clear()
