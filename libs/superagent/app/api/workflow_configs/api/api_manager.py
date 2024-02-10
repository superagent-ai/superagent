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
    AgentUpdate as AgentUpdateRequest,
)
from app.models.request import (
    Datasource as DatasourceRequest,
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

from .base import BaseApiAgentManager

logger = logging.getLogger(__name__)


class ApiManager:
    def __init__(self, api_user, agent_manager: BaseApiAgentManager):
        self.api_user = api_user
        self.agent_manager = agent_manager

    async def update_tool(
        self,
        assistant: AgentUpdateRequest,
        tool: ToolUpdateRequest,
        data: ToolUpdateRequest,
    ):
        tool = await self.agent_manager.get_tool(assistant, tool)

        await api_update_tool(
            tool_id=tool.id,
            body=data,
            api_user=self.api_user,
        )
        logger.info(f"Updated tool: {tool.name} - {assistant.name}")

    async def delete_tool(self, assistant: AgentUpdateRequest, tool: ToolUpdateRequest):
        tool = await self.agent_manager.get_tool(assistant, tool)

        await api_delete_tool(
            tool_id=tool.id,
            api_user=self.api_user,
        )
        logger.info(f"Deleted tool: {tool.name} - {assistant.name}")

    async def delete_datasource(
        self, assistant: AgentUpdateRequest, datasource: DatasourceUpdateRequest
    ):
        datasource = await self.agent_manager.get_datasource(assistant, datasource)

        await api_delete_datasource(
            datasource_id=datasource.id,
            api_user=self.api_user,
        )
        logger.info(f"Deleted datasource: {datasource.name} - {assistant.name}")

    async def create_datasource(self, data: DatasourceRequest):
        res = await api_create_datasource(
            body=data,
            api_user=self.api_user,
        )

        new_datasource = res.get("data", {})

        logger.info(f"Created datasource: {data}")
        return new_datasource

    async def create_tool(self, assistant: AgentUpdateRequest, data: ToolRequest):
        res = await api_create_tool(
            body=data,
            api_user=self.api_user,
        )

        new_tool = res.get("data", {})

        logger.info(f"Created tool: ${new_tool.name} - ${assistant.name}")
        return new_tool

    async def add_datasource(
        self, assistant: AgentUpdateRequest, data: DatasourceRequest
    ):
        assistant = await self.agent_manager.get_assistant(assistant)
        new_datasource = await self.create_datasource(data)

        await api_add_agent_datasource(
            agent_id=assistant.id,
            body=AgentDatasourceRequest(
                datasourceId=new_datasource.id,
            ),
            api_user=self.api_user,
        )
        logger.info(f"Added datasource: {new_datasource.name} - {assistant.name}")

    async def add_tool(self, assistant: AgentUpdateRequest, data: ToolRequest):
        assistant = await self.agent_manager.get_assistant(assistant)
        new_tool = await self.create_tool(assistant, data)

        await api_add_agent_tool(
            agent_id=assistant.id,
            body=AgentToolRequest(
                toolId=new_tool.id,
            ),
            api_user=self.api_user,
        )
        logger.info(f"Added tool: {new_tool.name} - {assistant.name}")
