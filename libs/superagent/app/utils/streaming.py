from __future__ import annotations

import asyncio
from typing import Any, AsyncIterator, Dict, List, Literal, Tuple, Union, cast

from langchain.callbacks.base import AsyncCallbackHandler
from langchain.schema.messages import BaseMessage
from langchain.schema.output import LLMResult
from litellm import cost_per_token, token_counter


class CustomAsyncIteratorCallbackHandler(AsyncCallbackHandler):
    """Callback handler that returns an async iterator."""

    queue: asyncio.Queue[str]

    done: asyncio.Event

    @property
    def always_verbose(self) -> bool:
        return True

    def __init__(self) -> None:
        self.queue = asyncio.Queue()
        self.done = asyncio.Event()

    async def on_chat_model_start(
        self,
        _serialized: Dict[str, Any],
        _messages: List[List[BaseMessage]],
        **_kwargs: Any,
    ) -> None:
        """Run when LLM starts running."""
        pass

    async def on_llm_start(self) -> None:
        # If two calls are made in a row, this resets the state
        self.done.clear()

    async def on_llm_new_token(self, token: str, **_kwargs: Any) -> None:
        if token is not None and token != "":
            self.queue.put_nowait(token)

    async def on_llm_end(self, response: LLMResult, **_kwargs: Any) -> None:
        # TODO:
        # This should be removed when Langchain has merged
        # https://github.com/langchain-ai/langchain/pull/9536
        for gen_list in response.generations:
            for gen in gen_list:
                if gen.message.content != "":
                    self.done.set()

    async def on_llm_error(
        self, _error: Union[Exception, KeyboardInterrupt], **_kwargs: Any
    ) -> None:
        self.done.set()

    async def aiter(self) -> AsyncIterator[str]:
        while not self.queue.empty() or not self.done.is_set():
            # Wait for the next token in the queue,
            # but stop waiting if the done event is set
            done, other = await asyncio.wait(
                [
                    # NOTE: If you add other tasks here, update the code below,
                    # which assumes each set has exactly one task each
                    asyncio.ensure_future(self.queue.get()),
                    asyncio.ensure_future(self.done.wait()),
                ],
                return_when=asyncio.FIRST_COMPLETED,
            )

            # Cancel the other task
            if other:
                other.pop().cancel()

            # Extract the value of the first completed task
            token_or_done = cast(Union[str, Literal[True]], done.pop().result())

            # If the extracted value is the boolean True, the done event was set
            if token_or_done is True:
                break

            # Otherwise, the extracted value is a token, which we yield
            yield token_or_done


class CostCalcAsyncHandler(AsyncCallbackHandler):
    """Callback handler that calculates the cost of the prompt and completion."""

    def __init__(self, model):
        self.model = model
        self.prompt: str = ""
        self.completion: str = ""
        self.prompt_tokens: int = 0
        self.completion_tokens: int = 0
        self.prompt_tokens_cost_usd: float = 0.0
        self.completion_tokens_cost_usd: float = 0.0

    def on_llm_start(self, _, prompts: List[str], **kwargs: Any) -> None:
        self.prompt = prompts[0]

    def on_llm_end(self, llm_result: LLMResult, **kwargs: Any) -> None:
        self.completion = llm_result.generations[0][0].message.content
        completion_tokens = self._calculate_tokens(self.completion)
        prompt_tokens = self._calculate_tokens(self.prompt)

        (
            prompt_tokens_cost_usd,
            completion_tokens_cost_usd,
        ) = self._calculate_cost_per_token(prompt_tokens, completion_tokens)

        self.prompt_tokens = prompt_tokens
        self.completion_tokens = completion_tokens
        self.prompt_tokens_cost_usd = prompt_tokens_cost_usd
        self.completion_tokens_cost_usd = completion_tokens_cost_usd

    def _calculate_tokens(self, text: str) -> int:
        return token_counter(model=self.model, text=text)

    def _calculate_cost_per_token(
        self, prompt_tokens: int, completion_tokens: int
    ) -> Tuple[float, float]:
        return cost_per_token(
            model=self.model,
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
        )
