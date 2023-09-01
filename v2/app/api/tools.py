import asyncio
import json

from fastapi import APIRouter, BackgroundTasks, Depends

from app.models.request import Tool as ToolRequest
from app.models.response import (
    Tool as ToolResponse,
)
from app.models.response import (
    ToolList as ToolListResponse,
)
from app.utils.api import get_current_api_user, handle_exception
from app.utils.prisma import prisma
from prisma.models import Tool

router = APIRouter()


@router.post(
    "/tools",
    name="create",
    description="Create a new tool",
    response_model=ToolResponse,
)
async def create(
    body: ToolRequest,
    api_user=Depends(get_current_api_user),
):
    """Endpoint for creating an tool"""
    try:
        body.metadata = json.dumps(body.metadata) if body.metadata else None
        data = await prisma.tool.create({**body.dict(), "apiUserId": api_user.id})
        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)


@router.get(
    "/tools",
    name="list",
    description="List all tools",
    response_model=ToolListResponse,
)
async def list(api_user=Depends(get_current_api_user)):
    """Endpoint for listing all tools"""
    try:
        data = await prisma.tool.find_many(
            where={"apiUserId": api_user.id}, order={"createdAt": "desc"}
        )
        for obj in data:
            if obj.metadata:
                obj.metadata = json.loads(obj.metadata)

        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)


@router.get(
    "/tools/{tool_id}",
    name="get",
    description="Get a specific tool",
    response_model=ToolResponse,
)
async def get(tool_id: str, api_user=Depends(get_current_api_user)):
    """Endpoint for getting a specific tool"""
    try:
        data = await prisma.tool.find_first(
            where={"id": tool_id, "apiUserId": api_user.id}
        )
        if data.metadata:
            data.metadata = json.loads(data.metadata)
        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)


@router.patch(
    "/tools/{tool_id}",
    name="update",
    description="Update a specific tool",
    response_model=ToolResponse,
)
async def update(
    tool_id: str, body: ToolRequest, api_user=Depends(get_current_api_user)
):
    """Endpoint for updating a specific tool"""
    try:
        data = await prisma.tool.update(
            where={"id": tool_id, "apiUserId": api_user.id},
            data=body.dict(),
        )
        if data.metadata:
            data.metadata = json.loads(data.metadata)
        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)


@router.delete(
    "/tools/{tool_id}",
    name="delete",
    description="Delete a specific tool",
)
async def delete(tool_id: str, api_user=Depends(get_current_api_user)):
    """Endpoint for deleting a specific tool"""
    try:
        await prisma.tool.delete(where={"id": tool_id})
        return {"success": True, "data": None}
    except Exception as e:
        handle_exception(e)
