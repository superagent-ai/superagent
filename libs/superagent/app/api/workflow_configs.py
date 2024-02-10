import json
import logging
from itertools import zip_longest
from typing import Any, Dict, List, Optional, Union

import segment.analytics as analytics
import yaml
from decouple import config
from fastapi import APIRouter, Body, Depends, HTTPException
from pydantic import BaseModel

from app.api.agents import (
    OpenAIAssistantSdk,
)
from app.api.agents import (
    add_datasource as api_add_agent_datasource,
)
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
from app.api.workflows import (
    add_step as api_add_step_workflow,
)
from app.models.request import (
    Agent as AgentRequest,
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
from app.models.request import (
    WorkflowStep as WorkflowStepRequest,
)
from app.utils.api import get_current_api_user, handle_exception
from app.utils.helpers import (
    MIME_TYPE_TO_EXTENSION,
    compare_dicts,
    get_mimetype_from_url,
    remove_key_if_present,
    rename_and_remove_keys,
)
from app.utils.llm import LLM_REVERSE_MAPPING
from app.utils.prisma import prisma
from prisma.enums import AgentType

SEGMENT_WRITE_KEY = config("SEGMENT_WRITE_KEY", None)

router = APIRouter()
logger = logging.getLogger(__name__)
analytics.write_key = SEGMENT_WRITE_KEY


class WorkflowDatasource(BaseModel):
    use_for: Optional[str]  # an alias for description
    urls: Optional[List[str]]


class WorkflowTool(BaseModel):
    name: str
    use_for: Optional[str]  # an alias for description
    metadata: Optional[Dict[Any, Any]]


class WorkflowAssistant(BaseModel):
    name: str
    llm: str  # an alias for llmModel
    prompt: str
    intro: Optional[str]  # an alias for initialMessage

    # tools: Optional[List[Dict[str, WorkflowTool]]]
    data: Optional[WorkflowDatasource]


class NestedWorkflowAssistant(WorkflowAssistant):
    tools: Optional[List[Dict[str, Union[WorkflowAssistant, WorkflowTool]]]]


class WorkflowConfig(BaseModel):
    workflows: List[Dict[str, NestedWorkflowAssistant]]


class DataTransformer:
    @staticmethod
    def transform_tool(tool: WorkflowTool, tool_type: str):
        rename_and_remove_keys(tool, {"use_for": "description"})

        if tool_type:
            tool["type"] = tool_type.upper()

        if tool.get("type") == "FUNCTION":
            tool["metadata"] = {
                "functionName": tool.get("name"),
                **tool.get("metadata", {}),
            }

    @staticmethod
    def transform_assistant(assistant: WorkflowAssistant, assistant_type: str):
        remove_key_if_present(assistant, "data")
        remove_key_if_present(assistant, "tools")
        rename_and_remove_keys(
            assistant, {"llm": "llmModel", "intro": "initialMessage"}
        )

        if assistant.get("llmModel"):
            assistant["llmModel"] = LLM_REVERSE_MAPPING[assistant["llmModel"]]

        if assistant_type:
            assistant["type"] = assistant_type.upper()


def get_first_key(dictionary) -> str | None:
    return next(iter(dictionary)) if dictionary else None


class WorkflowManager:
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
        try:
            res = await api_create_agent(
                body=data,
                api_user=self.api_user,
            )

            new_agent = res.get("data", {})

            logger.info(f"Created agent: {new_agent}")
            return new_agent
        except Exception as e:
            logger.error("Error creating agent: ", e)

    async def create_datasource(self, data: DatasourceRequest):
        try:
            res = await api_create_datasource(
                body=data,
                api_user=self.api_user,
            )

            new_datasource = res.get("data", {})

            logger.info(f"Created datasource: {data}")
            return new_datasource
        except Exception as e:
            logger.error("Error creating datasource: ", e)

    async def create_tool(self, assistant: AgentUpdateRequest, data: ToolRequest):
        try:
            res = await api_create_tool(
                body=data,
                api_user=self.api_user,
            )

            new_tool = res.get("data", {})

            logger.info(f"Created tool: ${new_tool.name} - ${assistant.name}")
            return new_tool
        except Exception as e:
            logger.error("Error creating tool: ", e)

    async def add_datasource(
        self, assistant: AgentUpdateRequest, data: DatasourceRequest
    ):
        agent = await self.get_assistant(assistant)
        new_datasource = await self.create_datasource(data)

        try:
            await api_add_agent_datasource(
                agent_id=agent.id,
                body=AgentDatasourceRequest(
                    datasourceId=new_datasource.id,
                ),
                api_user=self.api_user,
            )
            logger.info(f"Added datasource: {new_datasource.name} - {assistant.name}")
        except Exception as e:
            logger.error("Error adding datasource: ", e)

    async def add_tool(self, assistant: AgentUpdateRequest, data: ToolRequest):
        agent = await self.get_assistant(assistant)
        new_tool = await self.create_tool(assistant, data)

        try:
            await api_add_agent_tool(
                agent_id=agent.id,
                body=AgentToolRequest(
                    toolId=new_tool.id,
                ),
                api_user=self.api_user,
            )
            logger.info(f"Added tool: {new_tool.name} - {assistant.name}")
        except Exception as e:
            logger.error("Error adding tool: ", e)

    async def add_assistant(self, data: AgentRequest, order: int | None = None):
        try:
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
        except Exception as e:
            logger.error("Error adding assistant: ", e)

    async def delete_assistant(self, assistant: AgentUpdateRequest):
        try:
            agent = await self.get_assistant(assistant)

            await api_delete_agent(
                agent_id=agent.id,
                api_user=self.api_user,
            )
            logger.info(f"Deleted assistant: {agent.name}")
        except Exception as e:
            logger.error("Error deleting assistant: ", e)

    async def delete_datasource(
        self, assistant: AgentUpdateRequest, datasource: DatasourceUpdateRequest
    ):
        try:
            datasource = await self.get_datasource(assistant, datasource)

            await api_delete_datasource(
                datasource_id=datasource.id,
                api_user=self.api_user,
            )
            logger.info(f"Deleted datasource: {datasource.name} - {assistant.name}")
        except Exception as e:
            logger.error("Error deleting datasource: ", e)

    async def delete_tool(self, assistant: AgentUpdateRequest, tool: ToolUpdateRequest):
        try:
            tool = await self.get_tool(assistant, tool)

            await api_delete_tool(
                tool_id=tool.id,
                api_user=self.api_user,
            )
            logger.info(f"Deleted tool: {tool.name} - {assistant.name}")
        except Exception as e:
            logger.error("Error deleting tool: ", e)

    async def update_assistant(
        self, assistant: AgentUpdateRequest, data: AgentUpdateRequest
    ):
        try:
            agent = await self.get_assistant(assistant)

            await api_update_agent(
                agent_id=agent.id,
                body=data,
                api_user=self.api_user,
            )
            logger.info(f"Updated assistant: {agent.name}")
        except Exception as e:
            logger.error("Error updating assistant: ", e)

    async def update_tool(
        self,
        assistant: AgentUpdateRequest,
        tool: ToolUpdateRequest,
        data: ToolUpdateRequest,
    ):
        try:
            tool = await self.get_tool(assistant, tool)

            await api_update_tool(
                tool_id=tool.id,
                body=data,
                api_user=self.api_user,
            )
            logger.info(f"Updated tool: {tool.name} - {assistant.name}")
        except Exception as e:
            logger.error("Error updating tool: ", e)


class SuperagentProcessor:
    def __init__(self, api_user, workflow_manager: WorkflowManager):
        self.api_user = api_user
        self.workflow_manager = workflow_manager

    async def process_tools(self, old_tools, new_tools, assistant):
        for old_tool_obj, new_tool_obj in zip_longest(
            old_tools, new_tools, fillvalue={}
        ):
            old_tool = old_tool_obj.get(get_first_key(old_tool_obj), {})
            new_tool = new_tool_obj.get(get_first_key(new_tool_obj), {})

            old_tool_type = old_tool.get("type")
            new_tool_type = new_tool.get("type")

            if old_tool_type and new_tool_type:
                if old_tool_type != new_tool_type:
                    await self.workflow_manager.delete_tool(
                        tool=ToolRequest(**old_tool),
                        assistant=assistant,
                    )
                    await self.workflow_manager.add_tool(
                        assistant=assistant,
                        data=ToolRequest(
                            **new_tool,
                        ),
                    )
                else:
                    changes = compare_dicts(old_tool, new_tool)
                    if changes:
                        await self.workflow_manager.update_tool(
                            assistant=assistant,
                            tool=ToolUpdateRequest(**old_tool),
                            data=ToolUpdateRequest(
                                **changes,
                            ),
                        )

            elif old_tool_type and not new_tool_type:
                await self.workflow_manager.delete_tool(
                    tool=ToolRequest(**old_tool),
                    assistant=assistant,
                )

            elif new_tool_type and not old_tool_type:
                await self.workflow_manager.add_tool(
                    assistant=assistant,
                    data=ToolRequest(
                        **new_tool,
                    ),
                )

    async def process_data(self, old_data, new_data, assistant):
        old_urls = old_data.get("urls") or []
        new_urls = new_data.get("urls") or []
        # Process data URLs changes
        for url in set(old_urls) | set(new_urls):
            type = get_mimetype_from_url(url)

            if url in old_urls and url not in new_urls:
                use_for = old_data.get("use_for") or ""
                datasource_name = f"{MIME_TYPE_TO_EXTENSION[type]} doc {use_for}"
                # TODO: find a better way to deciding which datasource to delete
                await self.workflow_manager.delete_datasource(
                    assistant=assistant,
                    datasource=DatasourceUpdateRequest(name=datasource_name),
                )

            elif url in new_urls and url not in old_urls:
                use_for = new_data.get("use_for") or ""
                datasource_name = f"{MIME_TYPE_TO_EXTENSION[type]} doc {use_for}"
                if type in MIME_TYPE_TO_EXTENSION:
                    await self.workflow_manager.add_datasource(
                        assistant,
                        data=DatasourceRequest(
                            # TODO: this will be changed once we implement superrag
                            name=datasource_name,
                            description=new_data.get("use_for"),
                            url=url,
                            type=MIME_TYPE_TO_EXTENSION[type],
                        ),
                    )


class OpenaiProcessor:
    def __init__(self, api_user, workflow_manager: WorkflowManager):
        self.api_user = api_user
        self.workflow_manager = workflow_manager

    async def process_tools(self, old_tools, new_tools, assistant):
        if old_tools != new_tools:
            agent = await self.workflow_manager.get_assistant(assistant)

            metadata = agent.metadata

            tool_types = [
                {
                    "type": get_first_key(tool),
                }
                for tool in new_tools
            ]

            metadata["tools"] = tool_types

            await self.workflow_manager.update_assistant(
                assistant=assistant,
                data=AgentUpdateRequest(
                    metadata=metadata,
                ),
            )

    async def process_data(self, old_data, new_data, assistant):
        old_urls = old_data.get("urls") or []
        new_urls = new_data.get("urls") or []

        if set(old_urls) != set(new_urls):
            agent = await self.workflow_manager.get_assistant(assistant)
            llm = await prisma.llm.find_first(
                where={
                    "provider": "OPENAI",
                    "apiUserId": self.api_user.id,
                }
            )

            assistant_sdk = OpenAIAssistantSdk(llm)
            metadata = agent.metadata

            file_ids = metadata.get("file_ids", [])

            while len(file_ids) > 0:
                file_id = file_ids.pop()
                await assistant_sdk.delete_file(file_id)

            for url in new_urls:
                file = await assistant_sdk.upload_file(url)
                file_ids.append(file.id)

            metadata["file_ids"] = file_ids

            await self.workflow_manager.update_assistant(
                assistant,
                data={
                    "metadata": metadata,
                },
            )


class ProcessorManager:
    def __init__(self, api_user, workflow_manager: WorkflowManager):
        self.api_user = api_user
        self.workflow_manager = workflow_manager

    async def get_processor(self, assistant):
        if assistant.type == AgentType.SUPERAGENT:
            return SuperagentProcessor(self.api_user, self.workflow_manager)
        elif assistant.type == AgentType.OPENAI_ASSISTANT:
            return OpenaiProcessor(self.api_user, self.workflow_manager)

    async def process_tools(self, old_tools, new_tools, assistant):
        processor = await self.get_processor(assistant)
        await processor.process_tools(old_tools, new_tools, assistant)

    async def process_data(self, old_data, new_data, assistant):
        processor = await self.get_processor(assistant)
        await processor.process_data(old_data, new_data, assistant)


class WorkflowProcessor:
    def __init__(self, api_user, workflow_manager: WorkflowManager):
        self.api_user = api_user
        self.workflow_manager = workflow_manager
        self.processor = ProcessorManager(self.api_user, self.workflow_manager)

    async def process_assistant(
        self,
        old_assistant_obj,
        new_assistant_obj,
        workflow_step_order: int | None = None,
    ):
        new_agent = None
        old_type = get_first_key(old_assistant_obj)
        new_type = get_first_key(new_assistant_obj)

        old_assistant = old_assistant_obj.get(old_type, {})
        new_assistant = new_assistant_obj.get(new_type, {})

        old_data = old_assistant.get("data") or {}
        new_data = new_assistant.get("data") or {}

        old_tools = old_assistant.get("tools") or []
        new_tools = new_assistant.get("tools") or []

        dt = DataTransformer()
        dt.transform_assistant(new_assistant, new_type)
        dt.transform_assistant(old_assistant, old_type)

        for tool in old_tools:
            tool_type = get_first_key(tool)
            tool = tool.get(tool_type, {})

            dt.transform_tool(tool, tool_type)

        for tool in new_tools:
            tool_type = get_first_key(tool)
            tool = tool.get(tool_type, {})

            dt.transform_tool(tool, tool_type)

        if old_type and new_type:
            old_assistant = AgentRequest(**old_assistant)
            new_assistant = AgentRequest(**new_assistant)

            if old_type != new_type:
                await self.workflow_manager.delete_assistant(
                    assistant=old_assistant,
                )
                await self.workflow_manager.add_assistant(
                    data=new_assistant,
                    order=workflow_step_order,
                )
                # all tools and data should be re-created
                await self.processor.process_tools([], new_tools, new_assistant)
                await self.processor.process_data(
                    {},
                    new_data,
                    new_assistant,
                )

            else:
                changes = compare_dicts(old_assistant.dict(), new_assistant.dict())
                if changes:
                    await self.workflow_manager.update_assistant(
                        assistant=old_assistant,
                        data=AgentUpdateRequest(**changes),
                    )
                await self.processor.process_tools(old_tools, new_tools, new_assistant)
                await self.processor.process_data(
                    old_data,
                    new_data,
                    new_assistant,
                )
        elif old_type and not new_type:
            old_assistant = AgentRequest(**old_assistant)
            await self.processor.process_tools(old_tools, [], old_assistant)
            await self.processor.process_data(
                old_data,
                {},
                old_assistant,
            )

            await self.workflow_manager.delete_assistant(
                assistant=old_assistant,
            )
        elif new_type and not old_type:
            new_assistant = AgentRequest(**new_assistant)

            new_agent = await self.workflow_manager.add_assistant(
                data=new_assistant,
                order=workflow_step_order,
            )

            await self.processor.process_tools(old_tools, new_tools, new_assistant)
            await self.processor.process_data(
                old_data,
                new_data,
                new_assistant,
            )
        return new_agent

    async def process_assistants(self, old_config, new_config):
        old_assistants = old_config.get("workflows", [])
        new_assistants = new_config.get("workflows", [])

        workflow_step_order = 0
        for old_assistant_obj, new_assistant_obj in zip_longest(
            old_assistants, new_assistants, fillvalue={}
        ):
            await self.process_assistant(
                old_assistant_obj,
                new_assistant_obj,
                workflow_step_order,
            )
            workflow_step_order += 1


@router.post("/workflows/{workflow_id}/config")
async def add_config(
    workflow_id: str,
    yaml_content: str = Body(..., media_type="application/x-yaml"),
    api_user=Depends(get_current_api_user),
):
    try:
        workflow_config = await prisma.workflowconfig.find_first(
            where={"workflowId": workflow_id}, order={"createdAt": "desc"}
        )
        try:
            parsed_yaml = yaml.safe_load(yaml_content)
            # validating the parsed yaml
            new_config = WorkflowConfig(**parsed_yaml).dict()
        except yaml.YAMLError as e:
            logger.error("Invalid YAML: ", e)
            raise HTTPException(status_code=400, detail=f"Error parsing YAML: {str(e)}")

        new_config_str = json.dumps(new_config)

        new_config = json.loads(new_config_str)
        old_config = {} if not workflow_config else workflow_config.config

        workflow_manager = WorkflowManager(workflow_id, api_user)
        workflow_processor = WorkflowProcessor(
            api_user,
            workflow_manager,
        )

        await workflow_processor.process_assistants(old_config, new_config)

        config = await prisma.workflowconfig.create(
            data={
                "workflowId": workflow_id,
                "config": new_config_str,
                "apiUserId": api_user.id,
            }
        )

        return {"success": True, "data": config}
    except Exception as e:
        handle_exception(e)
