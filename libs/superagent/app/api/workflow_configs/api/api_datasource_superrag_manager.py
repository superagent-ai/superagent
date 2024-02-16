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
from app.api.workflow_configs.api.base import (
    BaseApiAgentManager,
    BaseApiDatasourceManager,
)
from app.models.request import (
    AgentTool as AgentToolRequest,
)
from app.models.request import (
    Tool as ToolRequest,
)
from prisma.enums import ToolType
from services.superrag import SuperRagService

logger = logging.getLogger(__name__)


class ApiDatasourceSuperRagManager(BaseApiDatasourceManager):
    """
    Class for managing datasources in SuperRag.
    """

    def __init__(self, api_user, agent_manager: BaseApiAgentManager):
        self.api_user = api_user
        self.agent_manager = agent_manager

        self.superrag_service = SuperRagService()

    async def _create_tool(self, assistant: dict, data: dict):
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

    async def _add_tool(self, assistant: dict, data: dict):
        new_tool = await self._create_tool(assistant, data)

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

    async def _add_superrag_tool(self, assistant: dict, data: dict):
        new_tool = {
            **data,
            "type": ToolType.SUPERRAG.value,
            "metadata": {
                "index_name": data.get("index_name"),
                "vector_database": {
                    "type": data.get("vector_database", {}).get("type")
                },
                "encoder": data.get("encoder"),
            },
            "name": data.get("index_name"),
        }

        await self._add_tool(assistant, new_tool)

    async def _delete_tool(self, assistant: dict, tool: dict):
        tool = await self.agent_manager.get_tool(assistant, tool)

        try:
            await api_delete_tool(
                tool_id=tool.id,
                api_user=self.api_user,
            )
            logger.info(f"Deleted tool: {tool.name} - {assistant.get('name')}")
        except Exception:
            logger.error(f"Error deleting tool: {tool} - {assistant}")

    async def _delete_superrag_tool(self, assistant: dict, tool: dict):
        tool = {
            **tool,
            "name": tool.get("index_name"),
        }

        await self._delete_tool(assistant, tool)

    async def add_datasource(self, assistant: dict, data: dict):
        # await self.superrag_service.aingest(data=data)
        await self._add_superrag_tool(assistant, data)

    async def delete_datasource(self, assistant: dict, datasource: dict):
        await self.superrag_service.adelete(datasource)
        await self._delete_superrag_tool(assistant, datasource)
