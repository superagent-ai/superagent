from fastapi import APIRouter
from app.utils.prisma import prisma
from app.utils.api import handle_exception
from app.models.response import Agent as AgentResponse, AgentList as AgentListResponse
from app.models.request import Agent as AgentRequest

router = APIRouter()


@router.post(
    "/agents",
    name="create",
    description="Create a new agent",
    response_model=AgentResponse,
)
async def create(body: AgentRequest):
    """Endpoint for creating an agent"""
    try:
        data = await prisma.agent.create(
            {"name": body.name, "llmId": body.llmId, "isActive": body.isActive}
        )
        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)


@router.get(
    "/agents",
    name="list",
    description="List all agents",
    response_model=AgentListResponse,
)
async def list():
    """Endpoint for listing all agents"""
    try:
        data = await prisma.agent.find_many(take=100)
        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)


@router.get(
    "/agents/{agent_id}",
    name="get",
    description="Get a single agent",
    response_model=AgentResponse,
)
async def get(agent_id: str):
    """Endpoint for getting a single agent"""
    try:
        data = await prisma.agent.find_unique(where={"id": agent_id})
        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)


@router.delete(
    "/agents/{agent_id}",
    name="delete",
    description="Delete an agent",
    response_model=None,
)
async def delete(agent_id: str):
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
async def update(agent_id: str, body: AgentRequest):
    """Endpoint for patching an agent"""
    try:
        data = await prisma.agent.update(
            where={"id": agent_id},
            data={"name": body.name, "llmId": body.llmId, "isActive": body.isActive},
        )
        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)


@router.post(
    "/agents/{agent_id}/invoke",
    name="invoke",
    description="Invoke an agent",
)
async def invoke(agent_id: str):
    """Endpoint for invoking an agent"""
    try:
        # Your code here
        pass
    except Exception as e:
        handle_exception(e)
