# flake8: noqa
import logging

from app.api.agents import (
    add_datasource as api_add_agent_datasource,
)
from app.api.agents import (
    add_tool as api_add_agent_tool,
)
from app.api.datasources import (
    create as api_create_datasource,
)
from app.api.datasources import (
    delete as api_delete_datasource,
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
    AgentDatasource as AgentDatasourceRequest,
)
from app.models.request import (
    AgentTool as AgentToolRequest,
)
from app.models.request import (
    Datasource as DatasourceRequest,
)
from app.models.request import (
    Tool as ToolRequest,
)
from app.models.request import (
    ToolUpdate as ToolUpdateRequest,
)
from app.utils.prisma import prisma
from app.vectorstores.base import VECTOR_DB_MAPPING

from .base import BaseApiAgentManager

logger = logging.getLogger(__name__)


class ApiManager:
    def __init__(self, api_user, agent_manager: BaseApiAgentManager):
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
        except Exception as err:
            logger.error(f"Error updating tool: {tool} - {assistant} - Error: {err}")

    async def delete_tool(self, assistant: dict, tool: dict):
        tool = await self.agent_manager.get_tool(assistant, tool)

        try:
            await api_delete_tool(
                tool_id=tool.id,
                api_user=self.api_user,
            )
            logger.info(f"Deleted tool: {tool.name} - {assistant.get('name')}")
        except Exception as err:
            logger.error(f"Error deleting tool: {tool} - {assistant} - Error: {err}")

    async def delete_datasource(self, assistant: dict, datasource: dict):
        datasource = await self.agent_manager.get_datasource(assistant, datasource)

        try:
            await api_delete_datasource(
                datasource_id=datasource.id,
                api_user=self.api_user,
            )
            logger.info(
                f"Deleted datasource: {datasource.name} - {assistant.get('name')}"
            )
        except Exception as err:
            logger.error(
                f"Error deleting datasource: {datasource} - {assistant} - Error: {err}"
            )

    async def create_datasource(self, data: dict):
        try:
            res = await api_create_datasource(
                body=DatasourceRequest.parse_obj(data),
                api_user=self.api_user,
            )

            new_datasource = res.get("data", {})

            logger.info(f"Created datasource: {data}")
            return new_datasource
        except Exception as err:
            logger.error(f"Error creating datasource: {data} - Error: {err}")

    async def create_tool(self, assistant: dict, data: dict):
        try:
            res = await api_create_tool(
                body=ToolRequest.parse_obj(data),
                api_user=self.api_user,
            )

            new_tool = res.get("data", {})

            logger.info(f"Created tool: ${new_tool.name} - ${assistant.get('name')}")
            return new_tool
        except Exception as err:
            logger.error(f"Error creating tool: {data} - Error: {err}")

    async def add_datasource(self, assistant: dict, data: dict):
        assistant = await self.agent_manager.get_assistant(assistant)
        new_datasource = await self.create_datasource(data)

        try:
            await api_add_agent_datasource(
                agent_id=assistant.id,
                body=AgentDatasourceRequest(
                    datasourceId=new_datasource.id,
                ),
                api_user=self.api_user,
            )
            logger.info(f"Added datasource: {new_datasource.name} - {assistant.name}")
        except Exception as err:
            logger.error(
                f"Error adding datasource: {new_datasource} - {assistant} - Error: {err}"
            )

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
        except Exception as err:
            logger.error(f"Error adding tool: {new_tool} - {assistant} - Error: {err}")

    def get_vector_database_by_provider(self, provider: str):
        return prisma.vectordb.find_first(
            where={
                "provider": VECTOR_DB_MAPPING.get(provider),
                "apiUserId": self.api_user.id,
            }
        )

    def get_vector_database_by_user_id(self):
        return prisma.vectordb.find_first(
            where={
                "apiUserId": self.api_user.id,
            }
        )
