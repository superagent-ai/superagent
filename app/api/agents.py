import json
import logging
from queue import Queue
from typing import Any, Dict

from decouple import config
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from fastapi.security.api_key import APIKey

from app.lib.agents.handler import AgentHandler
from app.lib.agents.factory import AgentFactory
from app.lib.auth.api import get_api_key
from app.lib.auth.prisma import JWTBearer
from app.lib.models.agent import Agent, PredictAgent
from app.lib.prisma import prisma

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/agents", name="Create agent", description="Create a new agent")
async def create_agent(body: Agent, token=Depends(JWTBearer())):
    """Agents endpoint"""
    try:
        agent = prisma.agent.create(
            {
                "name": body.name,
                "description": body.description,
                "avatarUrl": body.avatarUrl,
                "type": body.type,
                "llm": json.dumps(body.llm),
                "hasMemory": body.hasMemory,
                "userId": token["userId"],
                "promptId": body.promptId,
            },
            include={"user": True},
        )

        return {"success": True, "data": agent}

    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@router.get("/agents", name="List all agents", description="List all agents")
async def read_agents(token=Depends(JWTBearer())):
    """Agents endpoint"""
    try:
        agents = prisma.agent.find_many(
            where={"userId": token["userId"]},
            include={
                "user": True,
            },
            order={"createdAt": "desc"},
        )
        return {"success": True, "data": agents}

    except Exception as e:
        logger.error(e)

    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="No agents found",
    )


@router.get(
    "/agents/library",
    name="List library agents",
    description="List all library agents",
)
async def read_library_agents(token=Depends(JWTBearer())):
    """Library agentsendpoint"""
    try:
        agents = prisma.agent.find_many(
            where={"isListed": True},
            include={
                "user": True,
            },
            order={"createdAt": "desc"},
        )
        return {"success": True, "data": agents}
    except Exception as e:
        logger.error(e)

    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="No agents found",
    )


@router.get("/agents/{agentId}", name="Get agent", description="Get a specific agent")
async def read_agent(agentId: str, token=Depends(JWTBearer())):
    """Agent detail endpoint"""
    agent = prisma.agent.find_unique(where={"id": agentId}, include={"prompt": True})

    if agent:
        return {"success": True, "data": agent}

    logger.error(f"Agent with id: {agentId} not found")
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail=f"Agent with id: {agentId} not found",
    )


@router.delete(
    "/agents/{agentId}", name="Delete agent", description="Delete a specific agent"
)
async def delete_agent(agentId: str, token=Depends(JWTBearer())):
    """Delete agent endpoint"""
    try:
        prisma.agentmemory.delete_many(where={"agentId": agentId})
        prisma.agent.delete(where={"id": agentId})

        return {"success": True, "data": None}
    except Exception as e:
        logger.error(f"Couldn't delete agent with id {agentId}", exc_info=e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@router.patch(
    "/agents/{agentId}", name="Patch agent", description="Patch a specific agent"
)
async def patch_agent(agentId: str, body: dict, token=Depends(JWTBearer())):
    """Patch agent endpoint"""
    tags = body.get("tags")
    if tags or tags == []:
        body["tags"] = json.dumps(tags)

    try:
        prisma.agent.update(data=body, where={"id": agentId})
    except Exception as e:
        logger.error(f"Couldn't patch agent with id {agentId}", exc_info=e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    return {"success": True, "data": None}


@router.post(
    "/agents/{agentId}/predict",
    name="Prompt agent",
    description="Invoke a specific agent",
)
async def run_agent(
    agentId: str,
    body: PredictAgent,
    background_tasks: BackgroundTasks,
    api_key: APIKey = Depends(get_api_key),
):
    agent = prisma.agent.find_unique(where={"id": agentId}, include={"prompt": True})

    if not agent:
        logger.error(f"Cannot run agent with id: {agentId} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent with id: {agentId} not found",
        )

    data_queue = Queue()
    handler = AgentHandler(agent, body, api_key, data_queue)
    agent_strategy = AgentFactory.create_agent(handler.create_agent_base())
    agent_executor = agent_strategy.get_agent(session=body.session)

    if body.has_streaming:
        return await handler.handle_streaming(agent_executor, agentId, background_tasks)

    return await handler.handle_non_streaming(
        handler.create_agent_base(), agent_executor, agentId, background_tasks
    )
