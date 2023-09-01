import asyncio
from typing import AsyncIterable

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

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
from app.utils.prisma import prisma
from app.utils.streaming import CustomAsyncIteratorCallbackHandler

router = APIRouter()


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
        data = await prisma.agent.create({**body.dict(), "apiUserId": api_user.id})
        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)


@router.get(
    "/agents",
    name="list",
    description="List all agents",
    response_model=AgentListResponse,
)
async def list(api_user=Depends(get_current_api_user)):
    """Endpoint for listing all agents"""
    try:
        data = await prisma.agent.find_many(
            take=100, where={"apiUserId": api_user.id}, include={"llms": True}
        )
        return {"success": True, "data": data}
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
            where={"id": agent_id, "apiUserId": api_user.id}
        )
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
)
async def invoke(
    agent_id: str, body: AgentInvokeRequest, api_user=Depends(get_current_api_user)
):
    """Endpoint for invoking an agent"""

    async def send_message(
        agent: AgentBase, content: str, callback: CustomAsyncIteratorCallbackHandler
    ) -> AsyncIterable[str]:
        task = asyncio.create_task(agent.acall(inputs={"input": content}))
        try:
            async for token in callback.aiter():
                yield f"data: {token}\n\n"
        except Exception as e:
            print(f"Caught exception: {e}")
        finally:
            callback.done.set()

        await task

    try:
        session_id = body.sessionId
        input = body.input
        enable_streaming = body.enableStreaming
        callback = CustomAsyncIteratorCallbackHandler()
        agent = await AgentBase(
            agent_id=agent_id,
            session_id=session_id,
            enable_streaming=enable_streaming,
            callback=callback,
        ).get_agent()

        if enable_streaming:
            generator = send_message(agent, content=input, callback=callback)
            return StreamingResponse(generator, media_type="text/event-stream")

        output = await agent.acall(inputs={"input": input})
        return {"success": True, "data": output}
    except Exception as e:
        handle_exception(e)


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
async def add_datasource(
    agent_id: str,
    body: AgentToolRequest,
    api_user=Depends(get_current_api_user),
):
    """Endpoint for adding a tool to an agent"""
    try:
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
        return {"success": True, "data": agent_tool}
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
async def remove_datasource(
    agent_id: str, tool_id: str, api_user=Depends(get_current_api_user)
):
    """Endpoint for removing a tool from an agent"""
    try:
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
        return {"success": True, "data": agent_datasource}
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
