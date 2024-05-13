from typing import Optional

from litellm import model_cost

from app.memory.base import BaseMemory
from app.memory.memory_stores.base import BaseMemoryStore
from app.memory.message import BaseMessage

DEFAULT_TOKEN_LIMIT_RATIO = 0.75
DEFAULT_TOKEN_LIMIT = 3072


def get_context_window(model: str) -> int:
    max_input_tokens = model_cost.get(model, {}).get("max_input_tokens")

    # Some models don't have a provider prefix in their name
    # But they point to the same model
    # Example: claude-3-haiku-20240307 and anthropic/claude-3-haiku-20240307
    if not max_input_tokens:
        model_parts = model.split("/", 1)
        if len(model_parts) > 1:
            model_without_prefix = model_parts[1]
            max_input_tokens = model_cost.get(model_without_prefix, {}).get(
                "max_input_tokens", DEFAULT_TOKEN_LIMIT
            )
    return max_input_tokens


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
        self.context_window = (
            max_tokens or get_context_window(model=model) * DEFAULT_TOKEN_LIMIT_RATIO
        )

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
