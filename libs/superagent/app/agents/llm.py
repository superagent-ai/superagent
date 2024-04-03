import datetime
import logging
from typing import Optional

from litellm import acompletion

from app.agents.base import AgentBase
from app.utils.callbacks import CustomAsyncIteratorCallbackHandler
from app.utils.llm import LLM_REVERSE_MAPPING
from app.utils.prisma import prisma
from prisma.enums import AgentType, LLMProvider
from prisma.models import Agent
from prompts.json import JSON_FORMAT_INSTRUCTIONS

logger = logging.getLogger(__name__)


class FunctionCalling(AgentBase):
    def __init__(
        self,
        enable_streaming: Optional[bool],
        session_id: Optional[str],
        agent_config: Agent,
        agent_id: str,
    ):
        super().__init__(
            enable_streaming=enable_streaming,
            session_id=session_id,
            agent_config=agent_config,
            agent_id=agent_id,
        )

    async def _set_llm(self):
        openai_llm = await prisma.llm.find_first(
            where={
                "provider": LLMProvider.OPENAI.value,
                "apiUserId": self.agent_config.apiUserId,
            }
        )

        if not openai_llm:
            raise Exception("Please make sure you have an OpenAI LLM configured.")

        class AgentLLM:
            llm = openai_llm

        self.agent_config.llms = [AgentLLM()]

    async def _set_tools_return_direct(self):
        for agent_tool in self.agent_config.tools:
            agent_tool.tool.returnDirect = True

    async def init(self):
        self.agent_config.type = AgentType.SUPERAGENT
        self.agent_config.llmModel = LLM_REVERSE_MAPPING.get("gpt-3.5-turbo-0125")
        self.agent_id = self.agent_config.id

        await self._set_llm()
        await self._set_tools_return_direct()

        return self


DEFAULT_PROMPT = (
    "You are a helpful AI Assistant, answer the users questions to "
    "the best of your ability."
)


class LLMAgent(AgentBase):
    def get_llm_params(self):
        llm = self.agent_config.llms[0].llm
        params = self.llm_params.dict() if self.llm_params else {}

        options = {
            **(self.agent_config.metadata or {}),
            **(llm.options or {}),
            **(params),
        }
        return {
            "temperature": options.get("temperature"),
            "max_tokens": options.get("max_tokens"),
        }

    async def _get_prompt(self):
        base_prompt = self.agent_config.prompt or DEFAULT_PROMPT
        print("OUTPUT SCHEMA", self.output_schema)

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

    async def get_agent(self):
        enable_streaming = self.enable_streaming
        agent_config = self.agent_config
        session_id = self.session_id
        model = agent_config.metadata.get("model", "gpt-3.5-turbo-0125")
        api_key = agent_config.llms[0].llm.apiKey
        prompt = await self._get_prompt()

        class CustomAgentExecutor:
            def __init__(self, llm_agent_instance: LLMAgent, *args, **kwargs):
                super().__init__(*args, **kwargs)
                self.llm_agent_instance = llm_agent_instance

            async def ainvoke(self, input, *_, **kwargs):
                function_calling_res = {}

                if len(agent_config.tools) > 0:
                    function_calling = await FunctionCalling(
                        enable_streaming=False,
                        session_id=session_id,
                        agent_config=agent_config.copy(
                            deep=True,
                        ),
                        agent_id=agent_config.id,
                    ).init()
                    function_calling_agent = await function_calling.get_agent()

                    function_calling_res = await function_calling_agent.ainvoke(
                        input=input
                    )

                if function_calling_res.get("output"):
                    INPUT_TEMPLATE = "{input}\n Context: {context}\n"
                    input = INPUT_TEMPLATE.format(
                        input=input, context=function_calling_res.get("output")
                    )
                else:
                    INPUT_TEMPLATE = "{input}"
                    input = INPUT_TEMPLATE.format(input=input)

                res = await acompletion(
                    api_key=api_key,
                    model=model,
                    messages=[
                        {"content": prompt, "role": "system"},
                        {
                            "content": input,
                            "role": "user",
                        },
                    ],
                    stream=enable_streaming,
                    **self.llm_agent_instance.get_llm_params(),
                )

                output = ""
                if enable_streaming:
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
                    **function_calling_res,
                    "input": input,
                    "output": output,
                }

        agent_executor = CustomAgentExecutor(
            llm_agent_instance=self,
        )

        return agent_executor
