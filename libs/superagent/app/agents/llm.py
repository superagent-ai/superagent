import datetime
import json
import logging
from typing import Any

from decouple import config
from langchain_core.agents import AgentActionMessageLog
from langchain_core.messages import AIMessage
from langchain_core.utils.function_calling import convert_to_openai_function
from litellm import acompletion, completion

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
    agent_data: Agent, session_id: str, function: Any
) -> tuple[AgentActionMessageLog, Any]:
    name = function.name
    try:
        args = json.loads(function.arguments)
    except Exception as e:
        logger.error(f"Error parsing function arguments for {name}: {e}")
        raise e

    tools = get_tools(
        agent_data=agent_data,
        session_id=session_id,
    )
    tool_to_call = None
    for tool in tools:
        if tool.name == name:
            tool_to_call = tool
            break
    if not tool_to_call:
        raise Exception(f"Function {name} not found in tools")

    res = await tool_to_call._arun(**args)

    return (
        AgentActionMessageLog(
            tool=name,
            tool_input=args,
            log=f"\nInvoking: `{name}` with `{args}`\n\n\n",
            message_log=[
                AIMessage(
                    content="",
                    additional_kwargs={
                        "function_call": {
                            "arguments": args,
                            "name": name,
                        }
                    },
                )
            ],
        ),
        res,
    )


class LLMAgent(AgentBase):
    @property
    def tools(self):
        pass

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

    async def get_agent(self):
        agent_executor = LLMAgentOpenAIFunctionCallingExecutor(**self.__dict__)
        return agent_executor


class LLMAgentOpenAIFunctionCallingExecutor(LLMAgent):
    @property
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

    async def ainvoke(self, input, *_, **kwargs):
        self.input = input
        model = self.agent_data.metadata.get("model", "gpt-3.5-turbo-0125")
        tool_responses = []

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

            res = completion(
                model="gpt-3.5-turbo-0125",
                messages=self.messages_function_calling,
                tools=self.tools,
                stream=False,
                api_key=openai_api_key,
            )

            tool_calls = res.choices[0].message.get("tool_calls", [])
            for tool_call in tool_calls:
                try:
                    res = await call_tool(
                        agent_data=self.agent_data,
                        session_id=self.session_id,
                        function=tool_call.function,
                    )
                except Exception as e:
                    logger.error(
                        f"Error calling function {tool_call.function.name}: {e}"
                    )
                    continue
                tool_responses.append(res)

        if len(tool_responses) > 0:
            INPUT_TEMPLATE = "{input}\n Context: {context}\n"
            self.input = INPUT_TEMPLATE.format(
                input=self.input,
                context="\n\n".join(
                    [tool_response for (_, tool_response) in tool_responses]
                ),
            )

        params = self.llm_data.params.dict(exclude_unset=True)
        res = await acompletion(
            api_key=self.llm_data.llm.apiKey,
            model=model,
            messages=self.messages,
            stream=self.enable_streaming,
            **params,
        )

        output = ""
        if self.enable_streaming:
            streaming_callback = None
            for callback in kwargs["config"]["callbacks"]:
                if isinstance(callback, CustomAsyncIteratorCallbackHandler):
                    streaming_callback = callback

            if not streaming_callback:
                raise Exception("Streaming Callback not found")
            await streaming_callback.on_llm_start()

            async for chunk in res:
                token = chunk.choices[0].delta.content
                if token:
                    output += token
                    await streaming_callback.on_llm_new_token(token)

            streaming_callback.done.set()
        else:
            output = res.choices[0].message.content

        return {
            "intermediate_steps": tool_responses,
            "input": self.input,
            "output": output,
        }
