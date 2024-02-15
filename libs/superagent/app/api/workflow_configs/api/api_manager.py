import logging

from app.api.agents import (
    add_tool as api_add_agent_tool,
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
    AgentTool as AgentToolRequest,
)
from app.models.request import (
    Tool as ToolRequest,
)
from app.models.request import (
    ToolUpdate as ToolUpdateRequest,
)
from app.utils.prisma import prisma
from app.vectorstores.base import vector_db_mapping

from .base import BaseApiAgentManager

logger = logging.getLogger(__name__)


class ApiManager:
    def __init__(
        self,
        api_user,
        agent_manager: BaseApiAgentManager,
    ):
        self.api_user = api_user
        self.agent_manager = agent_manager

    async def update_tool(
        self,
        assistant: dict,
        tool: dict,
        data: dict,
    ):
        tool = await self.agent_manager.get_tool(assistant, tool)

        try:
            await api_update_tool(
                tool_id=tool.id,
                body=ToolUpdateRequest.parse_obj(data),
                api_user=self.api_user,
            )
            logger.info(f"Updated tool: {tool.name} - {assistant.get('name')}")
        except Exception:
            logger.error(f"Error updating tool: {tool} - {assistant}")

    async def delete_tool(self, assistant: dict, tool: dict):
        tool = await self.agent_manager.get_tool(assistant, tool)

        try:
            await api_delete_tool(
                tool_id=tool.id,
                api_user=self.api_user,
            )
            logger.info(f"Deleted tool: {tool.name} - {assistant.get('name')}")
        except Exception:
            logger.error(f"Error deleting tool: {tool} - {assistant}")

    async def create_tool(self, assistant: dict, data: dict):
        try:
            res = await api_create_tool(
                body=ToolRequest.parse_obj(data),
                api_user=self.api_user,
            )

            new_tool = res.get("data", {})

            logger.info(f"Created tool: ${new_tool.name} - ${assistant.get('name')}")
            return new_tool
        except Exception:
            logger.error(f"Error creating tool: {data}")

    async def add_tool(self, assistant: dict, data: dict):
        new_tool = await self.create_tool(assistant, data)

        assistant = await self.agent_manager.get_assistant(assistant)

        try:
            await api_add_agent_tool(
                agent_id=assistant.id,
                body=AgentToolRequest(
                    toolId=new_tool.id,
                ),
                api_user=self.api_user,
            )
            logger.info(f"Added tool: {new_tool.name} - {assistant.name}")
        except Exception:
            logger.error(f"Error adding tool: {new_tool} - {assistant}")

    def get_vector_database_by_provider(self, provider: str):
        return prisma.vectordb.find_first(
            where={
                "provider": vector_db_mapping.get(provider),
                "apiUserId": self.api_user.id,
            }
        )
