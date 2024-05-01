import datetime
import json
import logging
from functools import cached_property
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
)
from litellm.utils import (
    ChatCompletionDeltaToolCall,
    ChatCompletionMessageToolCall,
    Delta,
    Function,
)

from app.agents.base import AgentBase
from app.tools import get_tools
from app.utils.callbacks import CustomAsyncIteratorCallbackHandler
from app.utils.prisma import prisma
from prisma.enums import LLMProvider
from prisma.models import Agent
from prompts.default import DEFAULT_PROMPT
from prompts.function_calling_agent import FUNCTION_CALLING_AGENT_PROMPT
from prompts.json import JSON_FORMAT_INSTRUCTIONS

logger = logging.getLogger(__name__)


async def call_tool(
    agent_data: Agent, session_id: str, function: Function
) -> tuple[AgentActionMessageLog, Any]:
    try:
        args = json.loads(function.arguments)
    except Exception as e:
        logger.error(f"Error parsing function arguments for {function.name}: {e}")
        raise e

    tools = get_tools(
        agent_data=agent_data,
        session_id=session_id,
    )
    tool_to_call = None
    for tool in tools:
        if tool.name == function.name:
            tool_to_call = tool
            break
    if not tool_to_call:
        raise Exception(f"Function {function.name} not found in tools")

    logging.info(f"Calling tool {function.name} with arguments {args}")

    action_log = AgentActionMessageLog(
        tool=function.name,
        tool_input=args,
        log=f"\nInvoking: `{function.name}` with `{args}`\n\n\n",
        message_log=[
            AIMessage(
                content="",
                additional_kwargs={
                    "function_call": {
                        "arguments": json.dumps(args),
                        "name": function.name,
                    }
                },
            )
        ],
    )
    tool_res = None
    try:
        tool_res = await tool_to_call._arun(**args)
        logging.info(f"Tool {function.name} returned {tool_res}")
    except Exception as e:
        tool_res = f"Error calling {tool_to_call.name} tool with arguments {args}: {e}"
        logging.error(f"Error calling tool {function.name}: {e}")

    return (action_log, tool_res, tool_to_call.return_direct)


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

    NON_STREAMING_TOOL_PROVIDERS = [
        LLMProvider.GROQ,
        LLMProvider.BEDROCK,
    ]

    intermediate_steps = []

    async def _execute_tools(
        self,
        tool_calls: list[ChatCompletionMessageToolCall | ChatCompletionDeltaToolCall],
        **kwargs,
    ):
        messages: list = kwargs.get("messages")
        for tool_call in tool_calls:
            intermediate_step = await call_tool(
                agent_data=self.agent_data,
                session_id=self.session_id,
                function=tool_call.function,
            )
            (action_log, tool_res, return_direct) = intermediate_step
            self.intermediate_steps.append((action_log, tool_res))
            new_message = {
                "role": "tool",
                "name": tool_call.function.name,
                "content": tool_res,
            }
            if tool_call.id:
                new_message["tool_call_id"] = tool_call.id

            messages.append(new_message)
            if return_direct:
                if self.enable_streaming:
                    await self._stream_text_by_lines(tool_res)
                    self.streaming_callback.done.set()
                return tool_res

        self.messages = messages
        kwargs["messages"] = self.messages
        return await self._acompletion(**kwargs)

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
            if "index" in tool_call:
                del tool_call["index"]

        return tool_calls

    async def _process_stream_response(self, res: CustomStreamWrapper):
        tool_calls = []
        new_messages = self.messages
        output = ""

        chunks = []

        async for chunk in res:
            new_message = chunk.choices[0].delta
            if new_message.tool_calls:
                new_tool_calls = self._process_tool_calls(new_message)
                tool_calls.extend(new_tool_calls)

            if new_message.content:
                output += new_message.content
                if self._can_stream_directly:
                    await self.streaming_callback.on_llm_new_token(new_message.content)
            chunks.append(chunk)

        model_res = stream_chunk_builder(chunks=chunks)
        new_messages.append(model_res.choices[0].message)

        return (tool_calls, new_messages, output)

    async def _process_model_response(self, res: ModelResponse):
        tool_calls = []
        new_messages = self.messages

        new_message = res.choices[0].message
        if new_message.tool_calls:
            new_tool_calls = self._process_tool_calls(new_message)
            tool_calls.extend(new_tool_calls)

        new_messages.append(new_message)

        if new_message.content and self._can_stream_directly:
            await self._stream_text_by_lines(new_message.content)

        return (tool_calls, new_messages, new_message.content)

    async def _acompletion(self, **kwargs) -> Any:
        logger.info(f"Calling LLM with kwargs: {kwargs}")

        if kwargs.get("stream"):
            await self.streaming_callback.on_llm_start()

        # TODO: Remove this when Groq and Bedrock supports streaming with tools
        if self.llm_data.llm.provider in self.NON_STREAMING_TOOL_PROVIDERS:
            logger.info(
                f"Disabling streaming for {self.llm_data.llm.provider}, as tools are used"
            )
            kwargs["stream"] = False

        if kwargs.get("stream"):
            result = await self._process_stream_response(await acompletion(**kwargs))
        else:
            result = await self._process_model_response(await acompletion(**kwargs))

        tool_calls, new_messages, output = result

        self.messages = new_messages

        if tool_calls:
            return await self._execute_tools(tool_calls, **kwargs)

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
            "intermediate_steps": self.intermediate_steps,
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
        self.input = input
        tool_results = []

        if self.enable_streaming:
            self._set_streaming_callback(kwargs.get("config", {}).get("callbacks", []))

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

            for tool_call in res.choices[0].message.tool_calls:
                (action_log, tool_res, return_direct) = await call_tool(
                    agent_data=self.agent_data,
                    session_id=self.session_id,
                    function=tool_call.function,
                )
                tool_results.append((action_log, tool_res))
                if return_direct:
                    if self.enable_streaming:
                        await self._stream_text_by_lines(tool_res)
                        self.streaming_callback.done.set()

                    return {
                        "intermediate_steps": tool_results,
                        "input": self.input,
                        "output": tool_res,
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

        output = ""
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
