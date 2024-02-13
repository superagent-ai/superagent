import asyncio

from langchain.agents import AgentExecutor
from langchain.schema.messages import AIMessage
from langchain.schema.output import ChatGeneration, LLMResult
from litellm import acompletion

from app.agents.base import AgentBase


class LLMAgent(AgentBase):
    async def get_agent(self):
        enable_streaming = self.enable_streaming

        class CustomAgentExecutor(AgentExecutor):
            async def ainvoke(self, *args, **kwargs):
                print(*args)
                print(**kwargs)

                return None

        agent_executor = CustomAgentExecutor()

        return agent_executor
