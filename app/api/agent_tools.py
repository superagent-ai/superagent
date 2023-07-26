import logging

from fastapi import APIRouter, Depends, HTTPException, status
from starlette.requests import Request

from app.lib.auth.prisma import JWTBearer
from app.lib.models.agent_tool import AgentTool
from app.lib.prisma import prisma

logger = logging.getLogger(__name__)

router = APIRouter()


def parse_filter_params(request: Request):
    query_params = request.query_params
    filter_params = {}

    for k, v in query_params.items():
        if k.startswith("filter[") and k.endswith("]"):
            # Removing 'filter[' from start and ']' from end
            filter_key = k[7:-1]
            filter_params[filter_key] = v

    return filter_params


@router.post(
    "/agent-tools",
    name="Create agent tool",
    description="Create a agent tool",
)
async def create_agent_tool(body: AgentTool, token=Depends(JWTBearer())):
    """Create agent tool endpoint"""

    try:
        agent_tool = prisma.agenttool.create(
            {"agentId": body.agentId, "toolId": body.toolId}
        )
    except Exception as e:
        logger.error(
            "Cannot create agent tool for agent {body.agentId} and tool {body.toolId}",
            exc_info=e,
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return {"success": True, "data": agent_tool}


@router.get(
    "/agent-tools",
    name="List agent tools",
    description="List all agent tools",
)
async def read_agent_tools(
    filters: dict = Depends(parse_filter_params),
    expand: bool = False,
    token=Depends(JWTBearer()),
):
    """List agent tools endpoint"""

    try:
        agent_tools = prisma.agenttool.find_many(
            where=filters, include={"tool": expand}
        )
    except Exception as e:
        logger.error("Cannot read agent tools", exc_info=e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return {"success": True, "data": agent_tools}


@router.get(
    "/agent-tools/{agentToolId}",
    name="Get agent tool",
    description="Get a specific agent tool",
)
async def read_agent_tool(agentToolId: str, token=Depends(JWTBearer())):
    """Get an agent tool"""

    try:
        agent_tool = prisma.agenttool.find_unique(where={"id": agentToolId})
    except Exception as e:
        logger.error("Cannot read agent tool {agentToolId}", exc_info=e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return {"success": True, "data": agent_tool}


@router.delete(
    "/agent-tools/{agentToolId}",
    name="Delete agent tool",
    description="Delete a specific agent tool",
)
async def delete_agent_tool(agentToolId: str, token=Depends(JWTBearer())):
    """Delete agent tool endpoint"""

    try:
        prisma.agenttool.delete(where={"id": agentToolId})
    except Exception as e:
        logger.error("Cannot delete agent tool {agentToolId}", exc_info=e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return {"success": True, "data": None}
