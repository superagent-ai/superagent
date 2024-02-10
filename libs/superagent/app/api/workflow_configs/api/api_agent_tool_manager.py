import json
import logging

from app.api.agents import (
    add_tool as api_add_agent_tool,
)
from app.api.agents import (
    create as api_create_agent,
)
from app.api.agents import (
    delete as api_delete_agent,
)
from app.api.agents import (
    update as api_update_agent,
)
from app.api.tools import (
    create as api_create_tool,
)
from app.api.tools import (
    delete as api_delete_tool,
)
from app.api.tools import (
    update as api_update_tool,
)
from app.models.request import (
    Agent as AgentRequest,
)
from app.models.request import (
    AgentTool as AgentToolRequest,
)
from app.models.request import (
    AgentUpdate as AgentUpdateRequest,
)
from app.models.request import (
    DatasourceUpdate as DatasourceUpdateRequest,
)
from app.models.request import (
    Tool as ToolRequest,
)
from app.models.request import (
    ToolUpdate as ToolUpdateRequest,
)
from app.utils.prisma import prisma
from prisma.models import Agent as AgentModel

from .base import BaseApiAgentManager

logger = logging.getLogger(__name__)


class ApiAgentToolManager(BaseApiAgentManager):
    """
    This class is responsible for managing the workflow.
    It provides methods to add, delete, update tools, assistants, and datasources.
    """

    def __init__(self, parent_agent: AgentModel, api_user):
        self.parent_agent = parent_agent
        self.api_user = api_user

    async def get_assistant(self, assistant: AgentUpdateRequest):
        agent_tools = await prisma.agenttool.find_many(
            where={
                "agentId": self.parent_agent.id,
            },
            include={
                "agent": True,
                "tool": True,
            },
        )

        for agent_tool in agent_tools:
            if agent_tool.tool.name == assistant.name:
                # get agent from tool's metadata agent id
                metadata = json.loads(agent_tool.tool.metadata)
                agent = await prisma.agent.find_first(
                    where={
                        "id": metadata.get("agentId"),
                    }
                )
                return agent

    async def get_tool(self, assistant: AgentUpdateRequest, tool: ToolUpdateRequest):
        agent = await self.get_assistant(assistant)
        agent_tools = await prisma.agenttool.find_many(
            where={
                "agentId": agent.id,
            },
            include={
                "tool": True,
            },
        )

        for agent_tool in agent_tools:
            if agent_tool.tool.name == tool.name:
                return agent_tool.tool

    async def get_datasource(
        self, assistant: AgentUpdateRequest, datasource: DatasourceUpdateRequest
    ):
        agent = await self.get_assistant(assistant)

        agent_datasources = await prisma.agentdatasource.find_many(
            where={
                "agentId": agent.id,
            },
            include={
                "datasource": True,
            },
        )

        for agent_datasource in agent_datasources:
            if agent_datasource.datasource.name == datasource.name:
                return agent_datasource.datasource

    async def create_assistant(self, data: AgentRequest):
        res = await api_create_agent(
            body=data,
            api_user=self.api_user,
        )

        new_agent = res.get("data", {})

        logger.info(f"Created agent: {new_agent}")
        return new_agent

    async def create_tool(self, assistant: AgentUpdateRequest, data: ToolRequest):
        res = await api_create_tool(
            body=data,
            api_user=self.api_user,
        )

        new_tool = res.get("data", {})

        logger.info(f"Created tool: {new_tool.name} - {assistant.name}")
        return new_tool

    async def add_assistant(self, data: AgentRequest, order: int | None = None):
        new_agent = await self.create_assistant(data)

        new_tool = await self.create_tool(
            assistant=self.parent_agent,
            data=ToolRequest(
                name=new_agent.name,
                metadata={
                    "agentId": new_agent.id,
                    "apiKey": "",
                },
                type="AGENT",
            ),
        )

        await api_add_agent_tool(
            agent_id=self.parent_agent.id,
            body=AgentToolRequest(
                toolId=new_tool.id,
            ),
            api_user=self.api_user,
        )
        logger.info(f"Added assistant: {new_agent.name} - {self.parent_agent.name}")
        return new_agent

    async def get_agent_tool(self, assistant: AgentUpdateRequest):
        agent_tools = await prisma.agenttool.find_many(
            where={
                "agentId": self.parent_agent.id,
            },
            include={
                "tool": True,
            },
        )
        for agent_tool in agent_tools:
            if agent_tool.tool.name == assistant.name:
                return agent_tool.tool

    async def delete_assistant(self, assistant: AgentUpdateRequest):
        agent = await self.get_assistant(assistant)

        await api_delete_agent(
            agent_id=agent.id,
            api_user=self.api_user,
        )

        tool = await self.get_agent_tool(assistant)
        await api_delete_tool(
            tool_id=tool.id,
            api_user=self.api_user,
        )
        logger.info(f"Deleted assistant: {assistant.name}")

    async def update_assistant(
        self, assistant: AgentUpdateRequest, data: AgentUpdateRequest
    ):
        agent = await self.get_assistant(assistant)
        await api_update_agent(
            agent_id=agent.id,
            body=data,
            api_user=self.api_user,
        )

        tool = await self.get_agent_tool(assistant)

        await api_update_tool(
            tool_id=tool.id,
            body=ToolUpdateRequest(
                name=data.name,
            ),
            api_user=self.api_user,
        )
        logger.info(f"Updated assistant: {assistant.name}")
