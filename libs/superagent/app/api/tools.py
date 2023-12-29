import json

import segment.analytics as analytics
from decouple import config
from fastapi import APIRouter, Depends

from app.models.request import Tool as ToolRequest
from app.models.response import (
    Tool as ToolResponse,
)
from app.models.response import (
    ToolList as ToolListResponse,
)

# from app.tools.flow import generate_tool_config
from app.utils.api import get_current_api_user, handle_exception
from app.utils.prisma import prisma

SEGMENT_WRITE_KEY = config("SEGMENT_WRITE_KEY", None)

router = APIRouter()
analytics.write_key = SEGMENT_WRITE_KEY


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
        if SEGMENT_WRITE_KEY:
            analytics.track(api_user.id, "Created Tool")
        body.metadata = json.dumps(body.metadata) if body.metadata else ""
        data = await prisma.tool.create({**body.dict(), "apiUserId": api_user.id})

        # async def run_generate_tool_config(tool: ToolResponse):
        #    try:
        #        await generate_tool_config(
        #            tool=data,
        #        )
        #    except Exception as flow_exception:
        #        handle_exception(flow_exception)

        # asyncio.create_task(run_generate_tool_config(tool=data))
        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)


@router.get(
    "/tools",
    name="list",
    description="List all tools",
    response_model=ToolListResponse,
)
async def list(api_user=Depends(get_current_api_user), skip: int = 0, take: int = 50):
    """Endpoint for listing all tools"""
    try:
        import math

        data = await prisma.tool.find_many(
            skip=skip,
            take=take,
            where={"apiUserId": api_user.id},
            order={"createdAt": "desc"},
        )

        for tool in data:
            if isinstance(tool.toolConfig, dict):
                tool.toolConfig = json.dumps(tool.toolConfig)

        # Get the total count of agents
        total_count = await prisma.tool.count(where={"apiUserId": api_user.id})

        # Calculate the total number of pages
        total_pages = math.ceil(total_count / take)

        return {"success": True, "data": data, "total_pages": total_pages}
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
    if SEGMENT_WRITE_KEY:
        analytics.track(api_user.id, "Updated Tool")
    body.metadata = json.dumps(body.metadata) if body.metadata else ""
    data = await prisma.tool.update(
        where={"id": tool_id},
        data={
            **body.dict(),
            "apiUserId": api_user.id,
        },
    )

    if isinstance(data.toolConfig, dict):
        data.toolConfig = json.dumps(data.toolConfig)
    return {"success": True, "data": data}


@router.delete(
    "/tools/{tool_id}",
    name="delete",
    description="Delete a specific tool",
)
async def delete(tool_id: str, api_user=Depends(get_current_api_user)):
    """Endpoint for deleting a specific tool"""
    try:
        if SEGMENT_WRITE_KEY:
            analytics.track(api_user.id, "Deleted Tool")
        await prisma.agenttool.delete_many(where={"toolId": tool_id})
        await prisma.tool.delete(where={"id": tool_id})
        return {"success": True, "data": None}
    except Exception as e:
        handle_exception(e)
