import json
import logging

from fastapi import APIRouter, Depends, HTTPException, status

from app.lib.auth.prisma import JWTBearer
from app.lib.models.tool import Tool
from app.lib.prisma import prisma

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/tools", name="Create a tool", description="Create a new tool")
async def create_tool(body: Tool, token=Depends(JWTBearer())):
    """Create tool endpoint"""
    try:
        tool = prisma.tool.create(
            {
                "name": body.name,
                "type": body.type,
                "metadata": json.dumps(body.metadata),
                "userId": token["userId"],
                "description": body.description,
            },
            include={"user": True},
        )
        return {"success": True, "data": tool}
    except Exception as e:
        logger.error("Couldn't create tool", exc_info=e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@router.get("/tools", name="List tools", description="List all tools")
async def read_tools(token=Depends(JWTBearer())):
    """List tools endpoint"""
    try:
        tools = prisma.tool.find_many(
            where={"userId": token["userId"]},
            include={"user": True},
            order={"createdAt": "desc"},
        )
        return {"success": True, "data": tools}
    except Exception as e:
        logger.error("Couldn't find tools for user", exc_info=e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@router.get(
    "/tools/{toolId}",
    name="Get tool",
    description="Get a specific tool",
)
async def read_tool(toolId: str, token=Depends(JWTBearer())):
    """Get tool endpoint"""
    try:
        tool = prisma.tool.find_unique(where={"id": toolId}, include={"user": True})
        return {"success": True, "data": tool}
    except Exception as e:
        logger.error("Couldn't find tool {toolId}", exc_info=e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@router.delete(
    "/tools/{toolId}",
    name="Delete tool",
    description="Delete a specific tool",
)
async def delete_tool(toolId: str, token=Depends(JWTBearer())):
    """Delete tool endpoint"""
    try:
        prisma.tool.delete(where={"id": toolId})
        return {"success": True, "data": None}
    except Exception as e:
        logger.error("Couldn't delete tool {toolId}", exc_info=e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@router.patch("/tools/{toolId}", name="Patch tool", description="Patch a specific tool")
async def patch_tool(toolId: str, body: dict, token=Depends(JWTBearer())):
    """Patch tool endpoint"""
    try:
        body["metadata"] = json.dumps(body["metadata"])
        tool = prisma.tool.update(
            data=body,
            where={"id": toolId},
        )
        return {"success": True, "data": tool}
    except Exception as e:
        logger.error("Couldn't patch tool {toolId}", exc_info=e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
