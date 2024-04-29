from decouple import config
from langchain_community.tools import BaseTool

from app.agents.base import AgentFactory
from app.utils.prisma import prisma

API_BASE_URL = config("SUPERAGENT_API_URL")


class Agent(BaseTool):
    name = "Agent as a Tool"
    description = "useful for answering questions."
    return_direct = False

    def _run(self, input: str) -> str:
        agent_id = self.metadata["agentId"]
        params = self.metadata["params"]
        session_id = params.get("session_id")

        agent_data = prisma.agent.find_unique_or_raise(
            where={"id": agent_id},
            include={
                "llms": {"include": {"llm": True}},
                "datasources": {
                    "include": {"datasource": {"include": {"vectorDb": True}}}
                },
                "tools": {"include": {"tool": True}},
            },
        )

        agent_base = AgentFactory(
            agent_data=agent_data,
            enable_streaming=False,
            session_id=session_id,
        )

        agent = agent_base.get_agent()
        # TODO implement invoke function in AgentExecutor
        result = agent.invoke(
            input=input,
        )
        return result.get("output")

    async def _arun(self, input: str) -> str:
        agent_id = self.metadata["agentId"]
        params = self.metadata["params"]
        session_id = params.get("session_id")

        agent_data = await prisma.agent.find_unique_or_raise(
            where={"id": agent_id},
            include={
                "llms": {"include": {"llm": True}},
                "datasources": {
                    "include": {"datasource": {"include": {"vectorDb": True}}}
                },
                "tools": {"include": {"tool": True}},
            },
        )

        agent_base = AgentFactory(
            agent_data=agent_data,
            enable_streaming=False,
            session_id=session_id,
        )

        agent = await agent_base.get_agent()

        result = await agent.ainvoke(
            input=input,
        )

        return result.get("output")
