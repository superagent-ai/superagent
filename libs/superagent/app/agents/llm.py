import logging
from typing import Optional

from langchain.schema.messages import AIMessage
from langchain.schema.output import ChatGeneration, LLMResult
from litellm import acompletion

from app.agents.base import AgentBase
from app.utils.llm import LLM_REVERSE_MAPPING
from app.utils.prisma import prisma
from prisma.enums import AgentType, LLMProvider
from prisma.models import Agent

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


class LLMAgent(AgentBase):
    async def get_agent(self):
        enable_streaming = self.enable_streaming
        agent_config = self.agent_config
        session_id = self.session_id

        class CustomAgentExecutor:
            async def ainvoke(self, input, *_, **kwargs):
                function_calling_res = {"output": ""}

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

                model = agent_config.metadata.get("model", "gpt-3.5-turbo-0125")
                prompt = agent_config.prompt
                api_key = agent_config.llms[0].llm.apiKey

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
                )

                output = ""
                if enable_streaming:
                    streaming = kwargs["config"]["callbacks"][0]
                    await streaming.on_llm_start()

                    async for chunk in res:
                        token = chunk.choices[0].delta.content
                        if token:
                            output += token
                            await streaming.on_llm_new_token(token)

                    await streaming.on_llm_end(
                        response=LLMResult(
                            generations=[
                                [
                                    ChatGeneration(
                                        message=AIMessage(
                                            content=output,
                                        )
                                    )
                                ]
                            ],
                        )
                    )

                return {
                    **function_calling_res,
                    "input": input,
                    "output": output,
                }

        agent_executor = CustomAgentExecutor()

        return agent_executor
