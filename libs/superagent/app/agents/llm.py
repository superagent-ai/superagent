import asyncio
import datetime
import json
import logging
from dataclasses import dataclass
from functools import cached_property, partial
from typing import Any, cast

from decouple import config
from langchain_core.agents import AgentActionMessageLog
from langchain_core.messages import AIMessage
from langchain_core.utils.function_calling import convert_to_openai_function
from litellm import (
    CustomStreamWrapper,
    Message,
    ModelResponse,
    acompletion,
    get_llm_provider,
    get_supported_openai_params,
    stream_chunk_builder,
    token_counter,
)
from litellm.utils import (
    ChatCompletionDeltaToolCall,
    ChatCompletionMessageToolCall,
    Delta,
    Function,
)

from app.agents.base import AgentBase
from app.memory.base import BaseMessage
from app.memory.buffer_memory import BufferMemory
from app.memory.memory_stores.redis import RedisMemoryStore
from app.memory.message import MessageType
from app.tools import get_tools
from app.utils.callbacks import CustomAsyncIteratorCallbackHandler
from app.utils.prisma import prisma
from prisma.enums import LLMProvider
from prisma.models import Agent
from prompts.default import DEFAULT_PROMPT
from prompts.function_calling_agent import FUNCTION_CALLING_AGENT_PROMPT
from prompts.json import JSON_FORMAT_INSTRUCTIONS

logger = logging.getLogger(__name__)


@dataclass
class ToolCallResponse:
    action_log: AgentActionMessageLog
    result: Any
    return_direct: bool = False
    success: bool = True


async def execute_tool(
    agent_data: Agent, session_id: str, function: Function
) -> ToolCallResponse:
    action_log = AgentActionMessageLog(
        tool=function.name,
        tool_input=function.arguments,
        log=f"\nInvoking: `{function.name}` with `{function.arguments}`\n\n\n",
        message_log=[
            AIMessage(
                content="",
                additional_kwargs={
                    "function_call": {
                        "arguments": function.arguments,
                        "name": function.name,
                    }
                },
            )
        ],
    )

    try:
        args = json.loads(function.arguments)
    except Exception as e:
        msg = f"Error parsing arguments for {function.name}: {e}"
        logging.error(msg)
        return ToolCallResponse(
            action_log=action_log,
            result=msg,
            return_direct=False,
            success=False,
        )

    tools = get_tools(
        agent_data=agent_data,
        session_id=session_id,
    )

    logging.info(f"Calling tool {function.name} with arguments {args}")

    tool_to_call = None
    for tool in tools:
        if tool.name == function.name:
            tool_to_call = tool
            break

    if not tool_to_call:
        msg = f"Tool {function.name} not found in tools, avaliable tool names: {', '.join([tool.name for tool in tools])}"
        logger.error(msg)
        return ToolCallResponse(
            action_log=action_log,
            result=msg,
            return_direct=False,
            success=False,
        )

    try:
        tool_res = await tool_to_call._arun(**args)
        logging.info(f"Tool {function.name} returned {tool_res}")
        return ToolCallResponse(
            action_log=action_log,
            result=tool_res,
            return_direct=tool_to_call.return_direct,
            success=True,
        )
    except Exception as e:
        msg = f"Error calling {tool_to_call.name} tool with arguments {args}: {e}"
        logging.error(f"Error calling tool {function.name}: {e}")
        return ToolCallResponse(
            action_log=action_log,
            result=msg,
            success=False,
            return_direct=False,
        )


class LLMAgent(AgentBase):
    _streaming_callback: CustomAsyncIteratorCallbackHandler

    @property
    def streaming_callback(self):
        return self._streaming_callback

    # TODO: call all callbacks in the list, don't distinguish between them
    def _set_streaming_callback(
        self, callbacks: list[CustomAsyncIteratorCallbackHandler]
    ):
        for callback in callbacks:
            if isinstance(callback, CustomAsyncIteratorCallbackHandler):
                self._streaming_callback = callback
                break

        if not self._streaming_callback:
            raise Exception("Streaming Callback not found")

    @cached_property
    def tools(self):
        tools = get_tools(
            agent_data=self.agent_data,
            session_id=self.session_id,
        )
        return [
            {"type": "function", "function": convert_to_openai_function(tool)}
            for tool in tools
        ]

    @cached_property
    def memory(self) -> BufferMemory:
        redisMemoryStore = RedisMemoryStore(
            uri=config("REDIS_MEMORY_URL", "redis://localhost:6379/0"),
            session_id=self.session_id,
        )
        tokenizer_fn = partial(token_counter, model=self.llm_data.model)

        bufferMemory = BufferMemory(
            memory_store=redisMemoryStore,
            model=self.llm_data.model,
            tokenizer_fn=tokenizer_fn,
        )

        return bufferMemory

    @property
    def prompt(self):
        base_prompt = self.agent_data.prompt or DEFAULT_PROMPT

        prompt = f"Current date: {datetime.datetime.now().strftime('%Y-%m-%d')}\n"

        if self.output_schema:
            prompt += f"""
                {JSON_FORMAT_INSTRUCTIONS.format(
                    base_prompt=base_prompt, output_schema=self.output_schema
                )}
                Always surround the output with "```json```" to ensure proper formatting.
                """
        else:
            prompt = base_prompt

        messages = self.memory.get_messages(
            inital_token_usage=len(prompt),
        )
        if len(messages) > 0:
            messages.reverse()
            prompt += "\n\n Here's the previous conversation: <chat_history> \n"
            for message in messages:
                prompt += f"""<{message.type.value}> {message.content} </{message.type.value}>\n"""
            prompt += " </chat_history> \n"

        return prompt

    @property
    def _supports_tool_calling(self):
        (model, custom_llm_provider, _, _) = get_llm_provider(self.llm_data.model)
        supported_params = get_supported_openai_params(
            model=model, custom_llm_provider=custom_llm_provider
        )

        return "tools" in supported_params

    async def _stream_text_by_lines(self, output: str):
        output_by_lines = output.split("\n")
        if len(output_by_lines) > 1:
            for line in output_by_lines:
                await self.streaming_callback.on_llm_new_token(line)
                await self.streaming_callback.on_llm_new_token("\n")
        else:
            await self.streaming_callback.on_llm_new_token(output_by_lines[0])

    async def get_agent(self):
        if self._supports_tool_calling:
            logger.info("Using native function calling")
            return AgentExecutor(**self.__dict__)

        return AgentExecutorOpenAIFunc(**self.__dict__)


class AgentExecutor(LLMAgent):
    """Agent Executor for LLM (with native function calling)"""

    def __init__(
        self,
        **kwargs,
    ):
        super().__init__(
            **kwargs,
        )
        self._streaming_callback = None
        self._intermediate_steps = []

    NON_STREAMING_TOOL_PROVIDERS = [
        LLMProvider.GROQ,
        LLMProvider.BEDROCK,
        LLMProvider.COHERE_CHAT,
    ]

    @property
    def max_tool_call_depth(self):
        return 10

    async def _execute_tools(
        self,
        tool_calls: list[ChatCompletionMessageToolCall | ChatCompletionDeltaToolCall],
        depth: int,
        **kwargs,
    ):
        messages: list = kwargs.get("messages")
        for tool_call in tool_calls:
            tool_call_res = await execute_tool(
                agent_data=self.agent_data,
                session_id=self.session_id,
                function=tool_call.function,
            )
            self._intermediate_steps.append(
                (tool_call_res.action_log, tool_call_res.result)
            )
            new_message = {
                "role": "tool",
                "name": tool_call.function.name,
                "content": tool_call_res.result,
            }
            if tool_call.id:
                new_message["tool_call_id"] = tool_call.id

            messages.append(new_message)
            if tool_call_res.return_direct:
                if self.enable_streaming:
                    await self._stream_text_by_lines(tool_call_res.result)
                    self.streaming_callback.done.set()
                return tool_call_res.result

        self.messages = messages
        kwargs["messages"] = self.messages
        return await self._acompletion(depth=depth + 1, **kwargs)

    def _cleanup_output(self, output: str) -> str:
        # anthropic returns a XML formatted response
        # we need to get the content between <result> </result> tags
        if self.llm_data.llm.provider == LLMProvider.ANTHROPIC:
            from xmltodict import parse as xml_parse

            xml_output = "<root>" + output + "</root>"
            output = xml_parse(xml_output)
            output = output["root"]

            if isinstance(output, str):
                return output
            else:
                if "result" in output:
                    output = output.get("result")
                else:
                    output = output.get("#text")
        return output

    @property
    def _can_stream_directly(self):
        return (
            self.enable_streaming
            and self.llm_data.llm.provider not in self.NON_STREAMING_TOOL_PROVIDERS
            and self.llm_data.llm.provider != LLMProvider.ANTHROPIC
        )

    def _process_tool_calls(
        self, message: Message | Delta
    ) -> list[ChatCompletionMessageToolCall | ChatCompletionDeltaToolCall]:
        message.role = "assistant"
        tool_calls = message.tool_calls
        for tool_call in tool_calls:
            tool_call.type = "function"

        return tool_calls

    async def _process_stream_response(self, res: CustomStreamWrapper):
        tool_calls = []
        new_messages = self.messages
        output = ""

        chunks = []

        async for chunk in res:
            new_message = chunk.choices[0].delta
            if (
                hasattr(new_message, "tool_calls")
                and new_message.tool_calls is not None
            ):
                new_tool_calls = self._process_tool_calls(new_message)
                tool_calls.extend(new_tool_calls)

            if new_message.content:
                output += new_message.content
                if self._can_stream_directly:
                    await self.streaming_callback.on_llm_new_token(new_message.content)
            chunks.append(chunk)

        model_response = stream_chunk_builder(chunks=chunks)
        new_messages.append(model_response.choices[0].message.dict())

        return (tool_calls, new_messages, output)

    async def _process_model_response(self, res: ModelResponse):
        tool_calls = []
        new_messages = self.messages

        new_message = res.choices[0].message
        if hasattr(new_message, "tool_calls") and new_message.tool_calls is not None:
            new_tool_calls = self._process_tool_calls(new_message)
            tool_calls.extend(new_tool_calls)

        new_messages.append(new_message.dict())

        if new_message.content and self._can_stream_directly:
            await self.streaming_callback.on_llm_new_token(new_message.content)

        return (tool_calls, new_messages, new_message.content)

    async def _acompletion(self, depth: int = 0, **kwargs) -> Any:
        logger.info(f"Calling LLM with kwargs: {kwargs}")

        if kwargs.get("stream"):
            await self.streaming_callback.on_llm_start()

        # TODO: Remove this when Groq and Bedrock supports streaming with tools
        if (
            self.llm_data.llm.provider in self.NON_STREAMING_TOOL_PROVIDERS
            and len(self.tools) > 0
        ):
            logger.info(
                f"Disabling streaming for {self.llm_data.llm.provider}, as tools are used"
            )
            kwargs["stream"] = False

        model_completion = await acompletion(**kwargs)
        if kwargs.get("stream"):
            result = await self._process_stream_response(model_completion)
        else:
            result = await self._process_model_response(model_completion)

        tool_calls, new_messages, output = result

        if output:
            await self.memory.aadd_message(
                message=BaseMessage(
                    type=MessageType.AI,
                    content=output,
                )
            )

        if tool_calls:
            await asyncio.gather(
                *[
                    self.memory.aadd_message(
                        message=BaseMessage(
                            type=MessageType.TOOL_CALL,
                            content=tool_call.json(),
                        )
                    )
                    for tool_call in tool_calls
                ]
            )

        self.messages = new_messages

        if tool_calls:
            if depth < self.max_tool_call_depth:
                return await self._execute_tools(tool_calls, depth=depth, **kwargs)
            else:
                logger.error(
                    f"Exceeded max tool call depth of {self.max_tool_call_depth}"
                )
                if not output:
                    output = (
                        f"Exceeded max tool call depth of {self.max_tool_call_depth}"
                    )

        output = self._cleanup_output(output)

        if not self._can_stream_directly and self.enable_streaming:
            await self._stream_text_by_lines(output)

        if self.enable_streaming:
            self.streaming_callback.done.set()

        return output

    async def ainvoke(self, input, *_, **kwargs):
        self.input = input
        self.messages = [
            {
                "content": self.prompt,
                "role": "system",
            },
            {
                "content": self.input,
                "role": "user",
            },
        ]

        await self.memory.aadd_message(
            message=BaseMessage(
                type=MessageType.HUMAN,
                content=self.input,
            )
        )

        if self.enable_streaming:
            self._set_streaming_callback(kwargs.get("config", {}).get("callbacks", []))

        output = await self._acompletion(
            model=self.llm_data.model,
            api_key=self.llm_data.llm.apiKey,
            messages=self.messages,
            tools=self.tools if len(self.tools) > 0 else None,
            tool_choice="auto" if len(self.tools) > 0 else None,
            stream=self.enable_streaming,
            **self.llm_data.params.dict(exclude_unset=True),
        )

        return {
            "intermediate_steps": self._intermediate_steps,
            "input": self.input,
            "output": output,
        }


class AgentExecutorOpenAIFunc(LLMAgent):
    """Agent Executor that binded with OpenAI Function Calling"""

    def __init__(
        self,
        **kwargs,
    ):
        super().__init__(
            **kwargs,
        )
        self._streaming_callback = None

    @property
    def messages_function_calling(self):
        return [
            {
                "content": FUNCTION_CALLING_AGENT_PROMPT,
                "role": "system",
            },
            {
                "content": self.input,
                "role": "user",
            },
        ]

    @property
    def messages(self):
        return [
            {
                "content": self.prompt,
                "role": "system",
            },
            {
                "content": self.input,
                "role": "user",
            },
        ]

    async def ainvoke(self, input, *_, **kwargs):
        output = ""
        try:
            self.input = input
            tool_results = []

            if self.enable_streaming:
                self._set_streaming_callback(
                    kwargs.get("config", {}).get("callbacks", [])
                )

            if len(self.tools) > 0:
                openai_llm = await prisma.llm.find_first(
                    where={
                        "provider": LLMProvider.OPENAI.value,
                        "apiUserId": self.agent_data.apiUserId,
                    }
                )
                if openai_llm:
                    openai_api_key = openai_llm.apiKey
                else:
                    openai_api_key = config("OPENAI_API_KEY")
                    logger.warn(
                        "OpenAI API Key not found in database, using environment variable"
                    )

                res = await acompletion(
                    api_key=openai_api_key,
                    model="gpt-3.5-turbo-0125",
                    messages=self.messages_function_calling,
                    tools=self.tools,
                    stream=False,
                )

                tool_calls = []
                if (
                    hasattr(res.choices[0].message, "tool_calls")
                    and res.choices[0].message.tool_calls
                ):
                    tool_calls = res.choices[0].message.tool_calls

                for tool_call in tool_calls:
                    tool_call_res = await execute_tool(
                        agent_data=self.agent_data,
                        session_id=self.session_id,
                        function=tool_call.function,
                    )

                    # TODO: handle the failure in tool call case
                    # if not intermediate_step.success:
                    #     self.memory.add_message(
                    #         message=BaseMessage(
                    #             type=MessageType.TOOL_RESULT,
                    #             content=intermediate_step.result,
                    #         )
                    #     )

                    tool_results.append(
                        (tool_call_res.action_log, tool_call_res.result)
                    )

                    if tool_call_res.return_direct:
                        if self.enable_streaming:
                            await self._stream_text_by_lines(tool_call_res.result)
                            self.streaming_callback.done.set()

                        output = tool_call_res.result

                        return {
                            "intermediate_steps": tool_results,
                            "input": self.input,
                            "output": output,
                        }

            if len(tool_results) > 0:
                INPUT_TEMPLATE = "{input}\n Context: {context}\n"
                self.input = INPUT_TEMPLATE.format(
                    input=self.input,
                    context="\n\n".join(
                        [tool_response for (_, tool_response) in tool_results]
                    ),
                )

            params = self.llm_data.params.dict(exclude_unset=True)
            second_res = await acompletion(
                api_key=self.llm_data.llm.apiKey,
                model=self.llm_data.model,
                messages=self.messages,
                stream=self.enable_streaming,
                **params,
            )

            if self.enable_streaming:
                await self.streaming_callback.on_llm_start()
                second_res = cast(CustomStreamWrapper, second_res)

                async for chunk in second_res:
                    token = chunk.choices[0].delta.content
                    if token:
                        output += token
                        await self.streaming_callback.on_llm_new_token(token)

                self.streaming_callback.done.set()
            else:
                second_res = cast(ModelResponse, second_res)
                output = second_res.choices[0].message.content

            return {
                "intermediate_steps": tool_results,
                "input": self.input,
                "output": output,
            }
        finally:
            await self.memory.aadd_message(
                message=BaseMessage(
                    type=MessageType.HUMAN,
                    content=self.input,
                )
            )

            await self.memory.aadd_message(
                message=BaseMessage(
                    type=MessageType.AI,
                    content=output,
                )
            )
