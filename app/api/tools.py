import json

from fastapi import APIRouter, Depends

from app.lib.auth.prisma import JWTBearer, decodeJWT
from app.lib.models.tool import Tool
from app.lib.prisma import prisma

router = APIRouter()


@router.post("/tools", name="Create a tool", description="Create a new tool")
async def create_tool(body: Tool, token=Depends(JWTBearer())):
    """Create tool endpoint"""
    decoded = decodeJWT(token)

    tool = prisma.tool.create(
        {
            "name": body.name,
            "type": body.type,
            "metadata": json.dumps(body.metadata),
            "userId": decoded["userId"],
            "description": body.description,
        },
        include={"user": True},
    )

    return {"success": True, "data": tool}


@router.get("/tools", name="List tools", description="List all tools")
async def read_tools(token=Depends(JWTBearer())):
    """List tools endpoint"""
    decoded = decodeJWT(token)
    tools = prisma.tool.find_many(
        where={"userId": decoded["userId"]},
        include={"user": True},
        order={"createdAt": "desc"},
    )

    return {"success": True, "data": tools}


@router.get(
    "/tools/{toolId}",
    name="Get tool",
    description="Get a specific tool",
)
async def read_tool(toolId: str, token=Depends(JWTBearer())):
    """Get tool endpoint"""
    tool = prisma.tool.find_unique(where={"id": toolId}, include={"user": True})

    return {"success": True, "data": tool}


@router.delete(
    "/tools/{toolId}",
    name="Delete tool",
    description="Delete a specific tool",
)
async def delete_tool(toolId: str, token=Depends(JWTBearer())):
    """Delete tool endpoint"""
    prisma.tool.delete(where={"id": toolId})

    return {"success": True, "data": None}


@router.patch("/tools/{toolId}", name="Patch tool", description="Patch a specific tool")
async def patch_tool(toolId: str, body: dict, token=Depends(JWTBearer())):
    """Patch tool endpoint"""
    print(body)
    body["metadata"] = json.dumps(body["metadata"])

    tool = prisma.tool.update(
        data=body,
        where={"id": toolId},
    )

    return {"success": True, "data": tool}
