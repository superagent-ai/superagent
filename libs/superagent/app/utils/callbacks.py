from __future__ import annotations

import asyncio
import logging
from abc import ABC, abstractmethod
from typing import Any, AsyncIterator, Literal, Tuple, Union, cast

from agentops.langchain_callback_handler import AsyncLangchainCallbackHandler
from decouple import config
from langchain.schema.agent import AgentFinish
from langfuse import Langfuse
from litellm import cost_per_token, token_counter

logger = logging.getLogger(__name__)


class AsyncCallbackHandler(ABC):
    @abstractmethod
    async def on_agent_finish(self, content: str):
        pass

    @abstractmethod
    async def on_llm_start(self, prompt: str):
        pass

    @abstractmethod
    async def on_llm_new_token(self, token: str):
        pass

    @abstractmethod
    async def on_llm_end(self, response: str):
        pass

    @abstractmethod
    async def on_chain_start(self):
        pass

    @abstractmethod
    async def on_chain_end(self):
        pass

    @abstractmethod
    async def on_llm_error(self, response: str):
        pass

    @abstractmethod
    async def on_human_message(self, input: str):
        pass

    @abstractmethod
    async def aiter(self) -> AsyncIterator[str]:
        pass


class CustomAsyncIteratorCallbackHandler(AsyncCallbackHandler):
    """Callback handler that returns an async iterator."""

    queue: asyncio.Queue[str]

    done: asyncio.Event

    TIMEOUT_SECONDS = 30
    is_stream_started = False

    @property
    def always_verbose(self) -> bool:
        return True

    def __init__(self) -> None:
        self.queue = asyncio.Queue(maxsize=5)
        self.done = asyncio.Event()

    async def on_agent_finish(self, finish: AgentFinish, **_: Any) -> Any:
        """Run on agent end."""
        # This is for the tools whose return_direct property is set to True
        if not self.is_stream_started:
            output = finish.return_values["output"]
            for token in output.split("\n"):
                await self.on_llm_new_token(token + "\n")

            while not self.queue.empty():
                await asyncio.sleep(0.1)
        self.done.set()

    async def on_llm_start(self, *_: Any, **__: Any) -> None:
        # If two calls are made in a row, this resets the state
        self.done.clear()

    async def on_llm_new_token(self, token: str, **kwargs: Any) -> None:  # noqa
        if token is not None and token != "":
            has_put = False
            while not has_put:
                try:
                    await self.queue.put(token)
                    has_put = True
                except asyncio.QueueFull:
                    continue

    # async def on_llm_end(self, response, **kwargs: Any) -> None:  # noqa
    #     # TODO:
    #     # This should be removed when Langchain has merged
    #     # https://github.com/langchain-ai/langchain/pull/9536
    #     for gen_list in response.generations:
    #         for gen in gen_list:
    #             if gen.message.content != "":
    #                 self.done.set()

    async def on_chain_end(self) -> None:
        self.done.set()

    async def on_llm_error(self, *args: Any, **kwargs: Any) -> None:  # noqa
        self.done.set()

    async def aiter(self) -> AsyncIterator[str]:
        while not self.queue.empty() or not self.done.is_set():
            done, pending = await asyncio.wait(
                [
                    asyncio.ensure_future(self.queue.get()),
                    asyncio.ensure_future(self.done.wait()),
                ],
                return_when=asyncio.FIRST_COMPLETED,
                timeout=self.TIMEOUT_SECONDS,
            )
            if not done:
                logger.warning(f"{self.TIMEOUT_SECONDS} seconds of timeout reached")
                self.done.set()
                break

            for future in pending:
                future.cancel()

            token_or_done = cast(Union[str, Literal[True]], done.pop().result())

            if token_or_done is True:
                continue
            self.is_stream_started = True

            yield token_or_done

    async def on_chain_start(self, *args: Any, **kwargs: Any) -> None:
        pass

    async def on_human_message(self, input: str) -> None:
        pass

    async def on_llm_end(self, *args: Any, **kwargs: Any) -> None:
        pass

    async def on_llm_start(self, *args: Any, **kwargs: Any) -> None:
        pass


class CostCalcCallback(AsyncCallbackHandler):
    """Callback handler that calculates the cost of the prompt and completion."""

    def __init__(self, model):
        self.model = model
        self.prompt: str = ""
        self.completion: str = ""
        self.prompt_tokens: int = 0
        self.completion_tokens: int = 0
        self.prompt_tokens_cost_usd: float = 0.0
        self.completion_tokens_cost_usd: float = 0.0

    async def on_llm_start(self, prompt: str) -> None:  # noqa
        self.prompt = prompt

    async def on_llm_end(self, response: str) -> None:  # noqa
        self.completion = response
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

    async def on_agent_finish(self, content: str):
        pass

    async def on_llm_new_token(self, token: str):
        pass

    async def on_chain_start(self):
        pass

    async def on_chain_end(self):
        pass

    async def on_llm_error(self, response: str):
        pass

    async def on_human_message(self, input: str):
        pass

    async def aiter(self):
        pass


def get_langfuse_handler(
    *,
    workflow_id: str,
    agent_id: str,
    session_id: str,
    user_id: str,
):
    langfuse_secret_key = config("LANGFUSE_SECRET_KEY", "")
    langfuse_public_key = config("LANGFUSE_PUBLIC_KEY", "")
    langfuse_host = config("LANGFUSE_HOST", "https://cloud.langfuse.com")
    langfuse_handler = None
    if langfuse_public_key and langfuse_secret_key:
        langfuse = Langfuse(
            public_key=langfuse_public_key,
            secret_key=langfuse_secret_key,
            host=langfuse_host,
            sdk_integration="Superagent",
        )
        trace = langfuse.trace(
            id=session_id,
            name="Workflow",
            tags=[agent_id],
            metadata={"agentId": agent_id, "workflowId": workflow_id},
            user_id=user_id,
            session_id=workflow_id,
        )
        langfuse_handler = trace.get_langchain_handler()
        return langfuse_handler

    return None


def get_agentops_handler(
    *,
    session_id: str,
):
    agentops_api_key = config("AGENTOPS_API_KEY", default=None)
    agentops_org_key = config("AGENTOPS_ORG_KEY", default=None)

    if not agentops_api_key or not agentops_org_key:
        return None

    return AsyncLangchainCallbackHandler(
        api_key=agentops_api_key, org_key=agentops_org_key, tags=[session_id]
    )


def get_logging_handlers(
    *,
    workflow_id: str,
    agent_id: str,
    session_id: str,
    user_id: str,
):
    langfuse_handler = get_langfuse_handler(
        workflow_id=session_id,
        agent_id=session_id,
        session_id=session_id,
        user_id=session_id,
    )
    agentops_handler = get_agentops_handler(
        session_id=session_id,
    )

    callback_handlers = []
    if langfuse_handler:
        callback_handlers.append(langfuse_handler)
    if agentops_handler:
        callback_handlers.append(agentops_handler)

    return callback_handlers
