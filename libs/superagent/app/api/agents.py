import asyncio
import json
import logging
from typing import AsyncIterable

import segment.analytics as analytics
from agentops.langchain_callback_handler import AsyncLangchainCallbackHandler
from decouple import config
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from langchain.agents import AgentExecutor
from langchain.chains import LLMChain
from langfuse import Langfuse

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
from app.utils.llm import LLM_PROVIDER_MAPPING
from app.utils.prisma import prisma
from app.utils.streaming import CustomAsyncIteratorCallbackHandler

SEGMENT_WRITE_KEY = config("SEGMENT_WRITE_KEY", None)

router = APIRouter()
analytics.write_key = SEGMENT_WRITE_KEY
logging.basicConfig(level=logging.INFO)


# Agent endpoints
@router.post(
    "/agents",
    name="create",
    description="Create a new agent",
    response_model=AgentResponse,
)
async def create(body: AgentRequest, api_user=Depends(get_current_api_user)):
    """Endpoint for creating an agent"""
    try:
        if SEGMENT_WRITE_KEY:
            analytics.track(api_user.id, "Created Agent", {**body.dict()})
        agent = await prisma.agent.create(
            {**body.dict(), "apiUserId": api_user.id},
            include={
                "tools": {"include": {"tool": True}},
                "datasources": {"include": {"datasource": True}},
                "llms": {"include": {"llm": True}},
            },
        )
        provider = None
        for key, models in LLM_PROVIDER_MAPPING.items():
            if body.llmModel in models:
                provider = key
                break
        llm = await prisma.llm.find_first(
            where={"provider": provider, "apiUserId": api_user.id}
        )
        await prisma.agentllm.create({"agentId": agent.id, "llmId": llm.id})
        return {"success": True, "data": agent}
    except Exception as e:
        handle_exception(e)


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
        print(data)
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
        await prisma.agent.delete(where={"id": agent_id})
        return {"success": True, "data": None}
    except Exception as e:
        handle_exception(e)


@router.patch(
    "/agents/{agent_id}",
    name="update",
    description="Patch an agent",
    response_model=AgentResponse,
)
async def update(
    agent_id: str, body: AgentRequest, api_user=Depends(get_current_api_user)
):
    """Endpoint for patching an agent"""
    try:
        if SEGMENT_WRITE_KEY:
            analytics.track(api_user.id, "Updated Agent")
        data = await prisma.agent.update(
            where={"id": agent_id},
            data={
                **body.dict(),
                "apiUserId": api_user.id,
            },
        )
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

    agentops_api_key = config("AGENTOPS_API_KEY")
    agentops_org_key = config("AGENTOPS_ORG_KEY")

    agentops_handler = None
    if agentops_api_key:
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

    def get_analytics_info(result):
        intermediate_steps_to_obj = [
            {
                **vars(toolClass),
                "message_log": str(toolClass.message_log),
                "response": response,
            }
            for toolClass, response in result.get("intermediate_steps", [])
        ]

        properties = {
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
        }

        return properties

    async def send_message(
        agent: LLMChain | AgentExecutor,
        content: str,
        callback: CustomAsyncIteratorCallbackHandler,
    ) -> AsyncIterable[str]:
        try:
            task = asyncio.ensure_future(
                agent.acall(
                    inputs={"input": content},
                    tags=[agent_id],
                    callbacks=[
                        callback
                        for callback in [langfuse_handler, agentops_handler]
                        if callback
                    ],
                )
            )

            async for token in callback.aiter():
                yield ("event: message\n" f"data: {token}\n\n")

            await task

            result = task.result()

            if SEGMENT_WRITE_KEY:
                analytics.track(
                    api_user.id,
                    "Invoked Agent",
                    get_analytics_info(result),
                )
            if "intermediate_steps" in result:
                for step in result["intermediate_steps"]:
                    agent_action_message_log = step[0]
                    function = agent_action_message_log.tool
                    args = agent_action_message_log.tool_input
                    if function and args:
                        yield (
                            "event: function_call\n"
                            f'data: {{"function": "{function}", '
                            f'"args": {json.dumps(args)}}}\n\n'
                        )
        except Exception as error:
            logging.error(f"Error in send_message: {error}")
            if SEGMENT_WRITE_KEY:
                analytics.track(
                    api_user.id,
                    "Invoked Agent",
                    get_analytics_info(
                        {"error": str(error), "status_code": 500}),
                )
            yield ("event: error\n" f"data: {error}\n\n")
        finally:
            callback.done.set()

    logging.info("Invoking agent...")
    session_id = body.sessionId
    input = body.input
    enable_streaming = body.enableStreaming
    output_schema = body.outputSchema

    callback = CustomAsyncIteratorCallbackHandler()
    agent = await AgentBase(
        agent_id=agent_id,
        session_id=session_id,
        enable_streaming=enable_streaming,
        output_schema=output_schema,
        callback=callback,
        session_tracker=agentops_handler,
        llm_params=body.llm_params,
        agent_config=agent_config,
    ).get_agent()

    if enable_streaming:
        logging.info("Streaming enabled. Preparing streaming response...")

        generator = send_message(agent, content=input, callback=callback)
        return StreamingResponse(generator, media_type="text/event-stream")

    logging.info("Streaming not enabled. Invoking agent synchronously...")

    output = await agent.acall(
        inputs={"input": input},
        tags=[agent_id],
        callbacks=[
            callback for callback in [langfuse_handler, agentops_handler] if callback
        ],
    )

    if output_schema:
        try:
            output = json.loads(output.get("output"))
        except Exception as e:
            logging.error(f"Error parsing output: {e}")

    if not enable_streaming and SEGMENT_WRITE_KEY:
        analytics.track(
            api_user.id,
            "Invoked Agent",
            get_analytics_info(output),
        )

    if agentops_handler:
        agentops_handler.ao_client.end_session(
            end_state="Success", end_state_reason="Invocation completed"
        )
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
