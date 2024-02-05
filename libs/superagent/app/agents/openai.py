from langchain.agents import AgentExecutor
from langchain.agents.openai_assistant import OpenAIAssistantRunnable

from app.agents.base import AgentBase


class OpenAiAssistant(AgentBase):
    async def get_agent(self):
        assistant_id = self.agent_config.metadata.get("id")
        agent = OpenAIAssistantRunnable(assistant_id=assistant_id, as_agent=True)
        enable_streaming = self.enable_streaming

        class CustomAgentExecutor(AgentExecutor):
            async def ainvoke(self, *args, **kwargs):
                res = await super().ainvoke(*args, **kwargs)

                if enable_streaming:
                    output = res.get("output").split(" ")
                    # TODO: find a better way to get the streaming callback
                    streaming = kwargs["config"]["callbacks"][0]
                    await streaming.on_llm_start()
                    for token in output:
                        # send word to callback
                        await streaming.on_llm_new_token(token + " ")

                return res

        agent_executor = CustomAgentExecutor(agent=agent, tools=[])

        return agent_executor
