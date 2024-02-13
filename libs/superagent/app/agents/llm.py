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
                input = args[0]
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
                    stream=enable_streaming,
                )
                if enable_streaming:
                    streaming = kwargs["config"]["callbacks"][0]
                    await streaming.on_llm_start()

                    async for chunk in res:
                        await streaming.on_llm_new_token(
                            chunk.choices[0].delta.content + " "
                        )
                        if chunk.choices[0].finish_reason == "stop":
                            await streaming.on_llm_end(
                                response=LLMResult(
                                    generations=[
                                        [ChatGeneration(message=AIMessage(content=res))]
                                    ],
                                )
                            )

                return {
                    "input": input,
                    "output": res.choices[0].message.content,
                    "completion_tokens": res.usage.completion_tokens,
                    "prompt_tokens": res.usage.prompt_tokens,
                }

        agent_executor = CustomAgentExecutor()

        return agent_executor
