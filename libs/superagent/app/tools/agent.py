from decouple import config
from langchain_community.tools import BaseTool

from app.agents.base import AgentBase
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

        agent_config = prisma.agent.find_unique_or_raise(
            where={"id": agent_id},
            include={
                "llms": {"include": {"llm": True}},
                "datasources": {
                    "include": {"datasource": {"include": {"vectorDb": True}}}
                },
                "tools": {"include": {"tool": True}},
            },
        )

        agent_base = AgentBase(
            agent_id,
            enable_streaming=False,
            agent_config=agent_config,
            session_id=session_id,
        )

        agent = agent_base.get_agent()

        invoke_input = agent_base.get_input(
            input,
            agent_type=agent_config.type,
        )

        result = agent.invoke(
            input=invoke_input,
        )
        return result.get("output")

    async def _arun(self, input: str) -> str:
        agent_id = self.metadata["agentId"]
        params = self.metadata["params"]
        session_id = params.get("session_id")

        agent_config = await prisma.agent.find_unique_or_raise(
            where={"id": agent_id},
            include={
                "llms": {"include": {"llm": True}},
                "datasources": {
                    "include": {"datasource": {"include": {"vectorDb": True}}}
                },
                "tools": {"include": {"tool": True}},
            },
        )

        agent_base = AgentBase(
            agent_id,
            enable_streaming=False,
            agent_config=agent_config,
            session_id=session_id,
        )

        agent = await agent_base.get_agent()

        invoke_input = agent_base.get_input(
            input,
            agent_type=agent_config.type,
        )

        result = await agent.ainvoke(
            input=invoke_input,
        )

        return result.get("output")
