from langchain.schema.messages import AIMessage
from langchain.schema.output import ChatGeneration, LLMResult
from litellm import acompletion

from app.agents.base import AgentBase


class LLMAgent(AgentBase):
    async def get_agent(self):
        enable_streaming = self.enable_streaming
        agent_config = self.agent_config

        class CustomAgentExecutor:
            async def ainvoke(self, input, *_, **kwargs):
                model = agent_config.metadata.get("model", "gpt-3.5-turbo")
                prompt = agent_config.prompt
                api_key = agent_config.llms[0].llm.apiKey

                res = await acompletion(
                    api_key=api_key,
                    model=model,
                    messages=[
                        {"content": prompt, "role": "system"},
                        {"content": input, "role": "user"},
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
                    "input": input,
                    "output": output,
                }

        agent_executor = CustomAgentExecutor()

        return agent_executor
