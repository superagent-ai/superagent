import logging
from typing import Optional

from app.api.agents import (
    create as api_create_agent,
)
from app.api.agents import (
    delete as api_delete_agent,
)
from app.api.agents import (
    update as api_update_agent,
)
from app.api.workflows import add_step as api_add_step_workflow
from app.models.request import (
    Agent as AgentRequest,
)
from app.models.request import (
    AgentUpdate as AgentUpdateRequest,
)
from app.models.request import (
    DatasourceUpdate as DatasourceUpdateRequest,
)
from app.models.request import (
    ToolUpdate as ToolUpdateRequest,
)
from app.models.request import (
    WorkflowStep as WorkflowStepRequest,
)
from app.utils.prisma import prisma

from .base import BaseApiAgentManager

logger = logging.getLogger(__name__)


class ApiAgentManager(BaseApiAgentManager):
    """
    This class is responsible for managing the workflow.
    It provides methods to add, delete, update tools, assistants, and datasources.
    """

    def __init__(self, workflow_id: str, api_user):
        self.workflow_id = workflow_id
        self.api_user = api_user

    async def get_assistant(self, assistant: Optional[AgentUpdateRequest]):
        workflow_steps = await prisma.workflowstep.find_many(
            where={
                "workflowId": self.workflow_id,
            },
            include={
                "agent": True,
            },
        )
        for step in workflow_steps:
            if step.agent.name == assistant.name:
                return step.agent

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

    async def create_assistant(self, data: AgentRequest):
        res = await api_create_agent(
            body=data,
            api_user=self.api_user,
        )

        new_agent = res.get("data", {})

        logger.info(f"Created agent: {new_agent}")
        return new_agent

    async def add_assistant(self, data: AgentRequest, order: int | None = None):
        new_agent = await self.create_assistant(data)

        if order is not None:
            await api_add_step_workflow(
                workflow_id=self.workflow_id,
                body=WorkflowStepRequest(
                    agentId=new_agent.id,
                    order=order,
                ),
                api_user=self.api_user,
            )
            logger.info(f"Added assistant: {new_agent.name}")
        return new_agent

    async def delete_assistant(self, assistant: AgentUpdateRequest):
        print(assistant)
        assistant = await self.get_assistant(assistant)

        print(assistant)

        await api_delete_agent(
            agent_id=assistant.id,
            api_user=self.api_user,
        )

    async def update_assistant(
        self, assistant: AgentUpdateRequest, data: AgentUpdateRequest
    ):
        agent = await self.get_assistant(assistant)
        await api_update_agent(
            agent_id=agent.id,
            body=data,
            api_user=self.api_user,
        )
