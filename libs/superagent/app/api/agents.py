import asyncio
import json
import logging
import tempfile
from abc import ABC, abstractmethod
from typing import AsyncIterable, List, Optional

import requests
import segment.analytics as analytics
from agentops.langchain_callback_handler import AsyncLangchainCallbackHandler
from decouple import config
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from langchain.agents import AgentExecutor
from langchain.chains import LLMChain
from langfuse import Langfuse
from openai import AsyncOpenAI

from app.agents.base import AgentBase
from app.models.request import (
    Agent as AgentRequest,
)
from app.models.request import (
    AgentDatasource as AgentDatasourceRequest,
)
from app.models.request import (
    AgentInvoke as AgentInvokeRequest,
)
from app.models.request import (
    AgentLLM as AgentLLMRequest,
)
from app.models.request import (
    AgentTool as AgentToolRequest,
)
from app.models.request import (
    AgentUpdate as AgentUpdateRequest,
)
from app.models.response import (
    Agent as AgentResponse,
)
from app.models.response import (
    AgentDatasosurceList as AgentDatasosurceListResponse,
)
from app.models.response import (
    AgentInvoke as AgentInvokeResponse,
)
from app.models.response import (
    AgentList as AgentListResponse,
)
from app.models.response import (
    AgentToolList as AgentToolListResponse,
)
from app.utils.api import get_current_api_user, handle_exception
from app.utils.callbacks import CostCalcAsyncHandler, CustomAsyncIteratorCallbackHandler
from app.utils.llm import LLM_MAPPING, LLM_PROVIDER_MAPPING
from app.utils.prisma import prisma
from prisma.enums import AgentType
from prisma.models import LLM

SEGMENT_WRITE_KEY = config("SEGMENT_WRITE_KEY", None)
analytics.write_key = SEGMENT_WRITE_KEY

router = APIRouter()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class LLMPayload:
    def __init__(self, provider: str, model: str, user_id: str):
        self.provider = provider
        self.model = model
        self.user_id = user_id


async def get_llm_or_raise(data: LLMPayload) -> LLM:
    provider = data.provider

    if data.model:
        for key, models in LLM_PROVIDER_MAPPING.items():
            if data.model in models:
                provider = key
                break

    if not provider:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="LLM provider not found",
        )

    llm = await prisma.llm.find_first(
        where={"provider": provider, "apiUserId": data.user_id}
    )

    # if not llm:
    #    raise HTTPException(
    #        status_code=status.HTTP_400_BAD_REQUEST,
    #        detail="Please set an LLM first",
    #    )

    return llm


class Assistant(ABC):
    @abstractmethod
    async def create_assistant(self, body: AgentRequest) -> dict:
        pass

    @abstractmethod
    async def delete_assistant(self, assistant_id: str):
        pass

    @abstractmethod
    async def update_assistant(self, assistant_id: str, body: AgentRequest) -> dict:
        pass

    @abstractmethod
    async def upload_file(self, url: str):
        pass


class OpenAIAssistantSdk(Assistant):
    def __init__(self, llm: Optional[LLM] = None):
        self.llm = llm
        self.openai = AsyncOpenAI(api_key=self.llm.apiKey)

    async def create_assistant(self, body: AgentRequest) -> dict:
        openai_options = body.parameters or {}
        metadata = openai_options.get("metadata", {})
        tools = openai_options.get("tools", [])
        file_ids = openai_options.get("file_ids", [])

        oai_assistant = await self.openai.beta.assistants.create(
            model=LLM_MAPPING[body.llmModel],
            instructions=body.prompt,
            name=body.name,
            description=body.description,
            metadata=metadata,
            tools=tools,
            file_ids=file_ids,
        )
        return oai_assistant.json()

    async def delete_assistant(self, assistant_id: str):
        return await self.openai.beta.assistants.delete(assistant_id)

    async def update_assistant(
        self, assistant_id: str, body: AgentUpdateRequest
    ) -> dict:
        metadata = body.metadata or {}
        tools = metadata.get("tools", [])
        file_ids = metadata.get("file_ids", [])

        oai_assistant = await self.openai.beta.assistants.update(
            assistant_id=assistant_id,
            # passing only non-None values
            **{
                key: value
                for key, value in {
                    "model": body.llmModel,
                    "instructions": body.prompt,
                    "name": body.name,
                    "description": body.description,
                    # "metadata": metadata,
                    "tools": tools,
                    "file_ids": file_ids,
                }.items()
                if value is not None
            },
        )

        return oai_assistant.json()

    async def upload_file(self, url: str):
        with tempfile.TemporaryFile() as temp_file:
            temp_file.write(requests.get(url).content)
            temp_file.seek(0)
            file = temp_file.read()
        return await self.openai.files.create(
            file=file,
            purpose="assistants",
        )

    async def delete_file(self, file_id: str):
        return await self.openai.files.delete(file_id)


@router.post(
    "/agents",
    name="create",
    description="Create a new agent",
    response_model=AgentResponse,
)
async def create(body: AgentRequest, api_user=Depends(get_current_api_user)):
    """Endpoint for creating an agent"""
    user_id = api_user.id
    llm_provider = body.llmProvider
    llm_model = body.llmModel
    metadata = json.dumps(body.metadata) or "{}"

    if SEGMENT_WRITE_KEY:
        analytics.track(user_id, "Created Agent", {**body.dict()})

    llm = await get_llm_or_raise(
        LLMPayload(provider=llm_provider, model=llm_model, user_id=user_id)
    )

    if body.type:
        if body.type == AgentType.OPENAI_ASSISTANT:
            assistant = OpenAIAssistantSdk(llm)

            metadata = await assistant.create_assistant(body)

    agent = await prisma.agent.create(
        {
            **body.dict(exclude={"llmProvider", "parameters"}),
            "apiUserId": user_id,
            "metadata": metadata,
        },
        include={
            "tools": {"include": {"tool": True}},
            "datasources": {"include": {"datasource": True}},
            "llms": {"include": {"llm": True}},
        },
    )

    if llm:
        await prisma.agentllm.create({"agentId": agent.id, "llmId": llm.id})

    agent.metadata = json.dumps(metadata)

    return {
        "success": True,
        "data": agent,
    }


@router.get(
    "/agents",
    name="list",
    description="List all agents",
    response_model=AgentListResponse,
)
async def list(api_user=Depends(get_current_api_user), skip: int = 0, take: int = 50):
    """Endpoint for listing all agents"""
    try:
        import math

        data = await prisma.agent.find_many(
            skip=skip,
            take=take,
            where={"apiUserId": api_user.id},
            include={"llms": True},
        )

        # Get the total count of agents
        total_count = await prisma.agent.count(where={"apiUserId": api_user.id})

        # Calculate the total number of pages
        total_pages = math.ceil(total_count / take)

        for agent in data:
            agent.metadata = json.dumps(agent.metadata)

        return {"success": True, "data": data, "total_pages": total_pages}
    except Exception as e:
        handle_exception(e)


@router.get(
    "/agents/{agent_id}",
    name="get",
    description="Get a single agent",
    response_model=AgentResponse,
)
async def get(agent_id: str, api_user=Depends(get_current_api_user)):
    """Endpoint for getting a single agent"""
    try:
        data = await prisma.agent.find_first(
            where={"id": agent_id, "apiUserId": api_user.id},
            include={
                "tools": {"include": {"tool": True}},
                "datasources": {"include": {"datasource": True}},
                "llms": {"include": {"llm": True}},
            },
        )
        # TODO: Remove all stringifiying, create a new Pydantic model for the response
        data.metadata = json.dumps(data.metadata)

        for llm in data.llms:
            llm.llm.options = json.dumps(llm.llm.options)
        for tool in data.tools:
            if isinstance(tool.tool.toolConfig, dict):
                tool.tool.toolConfig = json.dumps(tool.tool.toolConfig)

        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)


@router.delete(
    "/agents/{agent_id}",
    name="delete",
    description="Delete an agent",
    response_model=None,
)
async def delete(agent_id: str, api_user=Depends(get_current_api_user)):
    """Endpoint for deleting an agent"""
    try:
        if SEGMENT_WRITE_KEY:
            analytics.track(api_user.id, "Deleted Agent")
        deleted = await prisma.agent.delete(where={"id": agent_id})

        metadata = deleted.metadata
        if metadata and metadata.get("id"):
            llm = await prisma.llm.find_first_or_raise(
                where={"provider": "OPENAI", "apiUserId": api_user.id}
            )
            oai = AsyncOpenAI(api_key=llm.apiKey)
            await oai.beta.assistants.delete(metadata.get("id"))
        return {"success": True, "data": deleted}
    except Exception as e:
        handle_exception(e)


@router.patch(
    "/agents/{agent_id}",
    name="update",
    description="Patch an agent",
    response_model=AgentResponse,
)
async def update(
    agent_id: str, body: AgentUpdateRequest, api_user=Depends(get_current_api_user)
):
    """Endpoint for patching an agent"""
    try:
        if SEGMENT_WRITE_KEY:
            analytics.track(api_user.id, "Updated Agent")

        agent = await prisma.agent.find_unique_or_raise(where={"id": agent_id})
        metadata = agent.metadata
        if agent.type:
            assistant_id = None

            if agent.type == AgentType.OPENAI_ASSISTANT:
                llm = await prisma.llm.find_first_or_raise(
                    where={"provider": "OPENAI", "apiUserId": api_user.id}
                )
                assistant = OpenAIAssistantSdk(llm)
                assistant_id = metadata.get("id")
                if assistant_id:
                    metadata = await assistant.update_assistant(assistant_id, body)

        new_agent_data = {
            **body.dict(exclude_unset=True),
        }

        if json.dumps(metadata) != json.dumps(agent.metadata):
            new_agent_data["metadata"] = metadata

        if new_agent_data.get("metadata"):
            new_agent_data["metadata"] = json.dumps(new_agent_data["metadata"])

        old_llm_model = agent.llmModel
        new_llm_model = LLM_MAPPING.get(body.llmModel)

        if not old_llm_model:
            old_llm_model = agent.metadata.get("model")

        if not new_llm_model and body.metadata:
            new_llm_model = body.metadata.get("model")

        if old_llm_model and new_llm_model and old_llm_model != new_llm_model:
            from app.utils.llm import get_llm_provider

            new_provider = get_llm_provider(new_llm_model)
            new_llm = await prisma.llm.find_first_or_raise(
                where={"provider": new_provider, "apiUserId": api_user.id}
            )
            await prisma.agentllm.update_many(
                where={
                    "agentId": agent_id,
                },
                data={"llmId": new_llm.id},
            )

        data = await prisma.agent.update(
            where={"id": agent_id},
            data=new_agent_data,
        )
        data.metadata = json.dumps(data.metadata)

        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)


@router.post(
    "/agents/{agent_id}/invoke",
    name="invoke",
    description="Invoke an agent",
    response_model=AgentInvokeResponse,
    openapi_extra={
        "x-fern-sdk-group-name": "agent",
        "x-fern-sdk-method-name": "invoke",
    },
)
async def invoke(
    agent_id: str, body: AgentInvokeRequest, api_user=Depends(get_current_api_user)
):
    """Endpoint for invoking an agent"""
    langfuse_secret_key = config("LANGFUSE_SECRET_KEY", "")
    langfuse_public_key = config("LANGFUSE_PUBLIC_KEY", "")
    langfuse_host = config("LANGFUSE_HOST", "https://cloud.langfuse.com")
    langfuse_handler = None
    if langfuse_public_key and langfuse_secret_key:
        langfuse = Langfuse(
            public_key=langfuse_public_key,
            secret_key=langfuse_secret_key,
            host=langfuse_host,
        )
        session_id = f"{agent_id}-{body.sessionId}" if body.sessionId else f"{agent_id}"
        trace = langfuse.trace(
            id=session_id,
            name="Assistant",
            tags=[agent_id],
            metadata={"agentId": agent_id},
            user_id=api_user.id,
        )
        langfuse_handler = trace.get_langchain_handler()

    agentops_api_key = config("AGENTOPS_API_KEY", default=None)
    agentops_org_key = config("AGENTOPS_ORG_KEY", default=None)

    agentops_handler = None
    if agentops_api_key and agentops_org_key:
        agentops_handler = AsyncLangchainCallbackHandler(
            api_key=agentops_api_key,
            org_key=agentops_org_key,
            tags=[agent_id, str(body.sessionId)],
        )

    agent_config = await prisma.agent.find_unique_or_raise(
        where={"id": agent_id},
        include={
            "llms": {"include": {"llm": True}},
            "datasources": {"include": {"datasource": {"include": {"vectorDb": True}}}},
            "tools": {"include": {"tool": True}},
        },
    )
    model = LLM_MAPPING.get(agent_config.llmModel)
    metadata = agent_config.metadata or {}
    if not model and metadata.get("model"):
        model = metadata.get("model")

    def track_agent_invocation(result):
        intermediate_steps_to_obj = [
            {
                **vars(toolClass),
                "message_log": str(toolClass.message_log),
                "response": response,
            }
            for toolClass, response in result.get("intermediate_steps", [])
        ]

        analytics.track(
            api_user.id,
            "Invoked Agent",
            {
                "agent": agent_config.id,
                "llm_model": agent_config.llmModel,
                "sessionId": session_id,
                # default http status code is 200
                "response": {
                    "status_code": result.get("status_code", 200),
                    "error": result.get("error", None),
                },
                "output": result.get("output", None),
                "input": result.get("input", None),
                "intermediate_steps": intermediate_steps_to_obj,
                "prompt_tokens": costCallback.prompt_tokens,
                "completion_tokens": costCallback.completion_tokens,
                "prompt_tokens_cost_usd": costCallback.prompt_tokens_cost_usd,
                "completion_tokens_cost_usd": costCallback.completion_tokens_cost_usd,
                "type": agent_config.type,
            },
        )

    costCallback = CostCalcAsyncHandler(model=model)

    monitoring_callbacks = [costCallback]

    if langfuse_handler:
        monitoring_callbacks.append(langfuse_handler)

    if agentops_handler:
        monitoring_callbacks.append(agentops_handler)

    async def send_message(
        agent: LLMChain | AgentExecutor,
        input: dict[str, str],
        streaming_callback: CustomAsyncIteratorCallbackHandler,
        callbacks: List[CustomAsyncIteratorCallbackHandler] = [],
    ) -> AsyncIterable[str]:
        try:
            task = asyncio.ensure_future(
                agent.ainvoke(
                    input,
                    config={
                        "callbacks": [streaming_callback, *callbacks],
                        "tags": [agent_id],
                    },
                )
            )

            async for token in streaming_callback.aiter():
                yield ("event: message\n" f"data: {token}\n\n")

            await task

            result = task.result()

            if SEGMENT_WRITE_KEY:
                try:
                    track_agent_invocation(
                        {
                            "user_id": api_user.id,
                            "agent": agent_config,
                            "session_id": body.sessionId,
                            **result,
                            **vars(cost_callback),
                        }
                    )
                except Exception as e:
                    logger.error(f"Error tracking agent invocation: {e}")

            if "intermediate_steps" in result:
                for step in result["intermediate_steps"]:
                    (agent_action_message_log, tool_response) = step
                    function = agent_action_message_log.tool
                    args = agent_action_message_log.tool_input
                    if function and args:
                        yield (
                            "event: function_call\n"
                            f'data: {{"function": "{function}", '
                            f'"args": {json.dumps(args)}, '
                            f'"response": {json.dumps(tool_response)}}}\n\n'
                        )
        except Exception as error:
            logger.error(f"Error in send_message: {error}")
            if SEGMENT_WRITE_KEY:
                try:
                    track_agent_invocation({"error": str(error), "status_code": 500})
                except Exception as e:
                    logger.error(f"Error tracking agent invocation: {e}")
            yield ("event: error\n" f"data: {error}\n\n")
        finally:
            streaming_callback.done.set()

    logger.info("Invoking agent...")
    session_id = body.sessionId
    input = body.input
    enable_streaming = body.enableStreaming
    output_schema = body.outputSchema
    cost_callback = CostCalcAsyncHandler(model=model)
    streaming_callback = CustomAsyncIteratorCallbackHandler()
    agent_base = AgentBase(
        agent_id=agent_id,
        session_id=session_id,
        enable_streaming=enable_streaming,
        output_schema=output_schema,
        callbacks=monitoring_callbacks,
        llm_params=body.llm_params,
        agent_config=agent_config,
    )
    agent = await agent_base.get_agent()

    agent_input = agent_base.get_input(
        input,
        agent_type=agent_config.type,
    )

    if enable_streaming:
        logger.info("Streaming enabled. Preparing streaming response...")

        generator = send_message(
            agent,
            input=agent_input,
            streaming_callback=streaming_callback,
            callbacks=[cost_callback],
        )
        return StreamingResponse(generator, media_type="text/event-stream")

    logger.info("Streaming not enabled. Invoking agent synchronously...")

    output = await agent.ainvoke(
        input=agent_input,
        config={
            "callbacks": [cost_callback],
            "tags": [agent_id],
        },
    )

    if output_schema:
        try:
            output = json.loads(output.get("output"))
        except Exception as e:
            logger.error(f"Error parsing output: {e}")

    if not enable_streaming and SEGMENT_WRITE_KEY:
        try:
            track_agent_invocation(
                {
                    "user_id": api_user.id,
                    "agent": agent_config,
                    "session_id": body.sessionId,
                    **output,
                    **vars(cost_callback),
                }
            )
        except Exception as e:
            logger.error(f"Error tracking agent invocation: {e}")

    return {"success": True, "data": output}


# Agent LLM endpoints
@router.post(
    "/agents/{agent_id}/llms",
    name="add_llm",
    description="Add LLM to agent",
    response_model=AgentResponse,
)
async def add_llm(
    agent_id: str, body: AgentLLMRequest, api_user=Depends(get_current_api_user)
):
    """Endpoint for adding an LLM to an agent"""
    try:
        await prisma.agentllm.create({**body.dict(), "agentId": agent_id})
        return {"success": True, "data": None}
    except Exception as e:
        handle_exception(e)


@router.delete(
    "/agents/{agent_id}/llms/{llm_id}",
    name="remove_llm",
    description="Remove LLM from agent",
)
async def remove_llm(
    agent_id: str, llm_id: str, api_user=Depends(get_current_api_user)
):
    """Endpoint for removing an LLM from an agent"""
    try:
        await prisma.agentllm.delete(
            where={"agentId_llmId": {"agentId": agent_id, "llmId": llm_id}}
        )
        return {"success": True, "data": None}
    except Exception as e:
        handle_exception(e)


# Agent Tool endpoints
@router.post(
    "/agents/{agent_id}/tools",
    name="add_tool",
    description="Add tool to agent",
    response_model=AgentResponse,
)
async def add_tool(
    agent_id: str,
    body: AgentToolRequest,
    api_user=Depends(get_current_api_user),
):
    """Endpoint for adding a tool to an agent"""
    try:
        if SEGMENT_WRITE_KEY:
            analytics.track(api_user.id, "Added Agent Tool")
        agent_tool = await prisma.agenttool.find_unique(
            where={
                "agentId_toolId": {
                    "agentId": agent_id,
                    "toolId": body.toolId,
                }
            }
        )
        if agent_tool:
            raise Exception("Agent tool already exists")
        agent_tool = await prisma.agenttool.create(
            {"toolId": body.toolId, "agentId": agent_id},
            include={"tool": True},
        )
        return {"success": True}
    except Exception as e:
        handle_exception(e)


@router.get(
    "/agents/{agent_id}/tools",
    name="list_tools",
    description="List agent tools",
    response_model=AgentToolListResponse,
)
async def list_tools(agent_id: str, api_user=Depends(get_current_api_user)):
    """Endpoint for listing agent tools"""
    try:
        agent_tools = await prisma.agenttool.find_many(where={"agentId": agent_id})
        return {"success": True, "data": agent_tools}
    except Exception as e:
        handle_exception(e)


@router.delete(
    "/agents/{agent_id}/tools/{tool_id}",
    name="remove_tool",
    description="Remove tool from agent",
)
async def remove_tool(
    agent_id: str, tool_id: str, api_user=Depends(get_current_api_user)
):
    """Endpoint for removing a tool from an agent"""
    try:
        if SEGMENT_WRITE_KEY:
            analytics.track(api_user.id, "Deleted Agent Tool")
        await prisma.agenttool.delete(
            where={
                "agentId_toolId": {
                    "agentId": agent_id,
                    "toolId": tool_id,
                }
            }
        )
        return {"success": True, "data": None}
    except Exception as e:
        handle_exception(e)


# Agent Datasource endpoints
@router.post(
    "/agents/{agent_id}/datasources",
    name="add_datasource",
    description="Add datasource to agent",
    response_model=AgentResponse,
)
async def add_datasource(
    agent_id: str,
    body: AgentDatasourceRequest,
    api_user=Depends(get_current_api_user),
):
    """Endpoint for adding a datasource to an agent"""
    try:
        if SEGMENT_WRITE_KEY:
            analytics.track(api_user.id, "Added Agent Datasource")

        agent_datasource = await prisma.agentdatasource.find_unique(
            where={
                "agentId_datasourceId": {
                    "agentId": agent_id,
                    "datasourceId": body.datasourceId,
                }
            }
        )

        if agent_datasource:
            raise Exception("Agent datasource already exists")

        agent_datasource = await prisma.agentdatasource.create(
            {"datasourceId": body.datasourceId, "agentId": agent_id},
            include={"datasource": True},
        )

        # TODO:
        # Enable this for finetuning models
        # async def run_datasource_flow():
        #    try:
        #        await process_datasource(body.datasourceId, agent_id)
        #    except Exception as flow_exception:
        #        handle_exception(flow_exception)

        # asyncio.create_task(run_datasource_flow())
        return {"success": True}
    except Exception as e:
        handle_exception(e)


@router.get(
    "/agents/{agent_id}/datasources",
    name="list_datasources",
    description="List agent datasources",
    response_model=AgentDatasosurceListResponse,
)
async def list_datasources(agent_id: str, api_user=Depends(get_current_api_user)):
    """Endpoint for listing agent datasources"""
    try:
        agent_datasources = await prisma.agentdatasource.find_many(
            where={"agentId": agent_id}
        )
        return {"success": True, "data": agent_datasources}
    except Exception as e:
        handle_exception(e)


@router.delete(
    "/agents/{agent_id}/datasources/{datasource_id}",
    name="remove_datasource",
    description="Remove datasource from agent",
)
async def remove_datasource(
    agent_id: str, datasource_id: str, api_user=Depends(get_current_api_user)
):
    """Endpoint for removing a datasource from an agent"""
    try:
        if SEGMENT_WRITE_KEY:
            analytics.track(api_user.id, "Deleted Agent Datasource")
        await prisma.agentdatasource.delete(
            where={
                "agentId_datasourceId": {
                    "agentId": agent_id,
                    "datasourceId": datasource_id,
                }
            }
        )

        # TODO:
        # Enable this for finetuning models
        # async def run_datasource_revalidate_flow():
        #    try:
        #        await revalidate_datasource(agent_id)
        #    except Exception as flow_exception:
        #        handle_exception(flow_exception)

        # asyncio.create_task(run_datasource_revalidate_flow())
        return {"success": True, "data": None}
    except Exception as e:
        handle_exception(e)
