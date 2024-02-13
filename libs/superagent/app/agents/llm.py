import asyncio

from langchain.agents import AgentExecutor
from langchain.schema.messages import AIMessage
from langchain.schema.output import ChatGeneration, LLMResult
from litellm import acompletion

from app.agents.base import AgentBase


class LLMAgent(AgentBase):
    async def get_agent(self):
        enable_streaming = self.enable_streaming
        agent_config = self.agent_config
        print(agent_config)

        class CustomAgentExecutor:
            async def ainvoke(self, *args, **kwargs):
                input = kwargs.get("input")
                model = agent_config.metadata["model"]
                prompt = agent_config.prompt
                api_key = agent_config.llms[0].llm.apiKey
                res = await acompletion(
                    model=model,
                    api_key=api_key,
                    messages=[
                        {"content": prompt, "role": "system"},
                        {"content": input, "role": "user"},
                    ],
                )
                return {
                    "input": input,
                    "output": res.choices[0].message.content,
                    "completion_tokens": res.usage.completion_tokens,
                    "prompt_tokens": res.usage.prompt_tokens,
                }

        agent_executor = CustomAgentExecutor()

        return agent_executor
