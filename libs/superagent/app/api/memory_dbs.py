import json

import segment.analytics as analytics
from decouple import config
from fastapi import APIRouter, Depends

from app.models.request import MemoryDb as MemoryDbRequest
from app.models.response import MemoryDb as MemoryDbResponse
from app.models.response import MemoryDbList as MemoryDbListResponse
from app.utils.api import get_current_api_user, handle_exception
from app.utils.prisma import prisma
from prisma import Json

SEGMENT_WRITE_KEY = config("SEGMENT_WRITE_KEY", None)

router = APIRouter()
analytics.write_key = SEGMENT_WRITE_KEY


@router.post(
    "/memory-db",
    name="create",
    description="Create a new Memory Database",
    response_model=MemoryDbResponse,
)
async def create(body: MemoryDbRequest, api_user=Depends(get_current_api_user)):
    """Endpoint for creating a Memory Database"""
    if SEGMENT_WRITE_KEY:
        analytics.track(api_user.id, "Created Memory Database")

    data = await prisma.memorydb.create(
        {
            **body.dict(),
            "apiUserId": api_user.id,
            "options": json.dumps(body.options),
        }
    )
    data.options = json.dumps(data.options)
    return {"success": True, "data": data}


@router.get(
    "/memory-dbs",
    name="list",
    description="List all Memory Databases",
    response_model=MemoryDbListResponse,
)
async def list(api_user=Depends(get_current_api_user)):
    """Endpoint for listing all Memory Databases"""
    try:
        data = await prisma.memorydb.find_many(
            where={"apiUserId": api_user.id}, order={"createdAt": "desc"}
        )
        # Convert options to string
        for item in data:
            item.options = json.dumps(item.options)
        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)


@router.get(
    "/memory-dbs/{memory_db_id}",
    name="get",
    description="Get a single Memory Database",
    response_model=MemoryDbResponse,
)
async def get(memory_db_id: str, api_user=Depends(get_current_api_user)):
    """Endpoint for getting a single Memory Database"""
    try:
        data = await prisma.memorydb.find_first(
            where={"id": memory_db_id, "apiUserId": api_user.id}
        )
        data.options = json.dumps(data.options)
        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)


@router.patch(
    "/memory-dbs/{memory_db_id}",
    name="update",
    description="Patch a Memory Database",
    response_model=MemoryDbResponse,
)
async def update(
    memory_db_id: str, body: MemoryDbRequest, api_user=Depends(get_current_api_user)
):
    """Endpoint for patching a Memory Database"""
    try:
        if SEGMENT_WRITE_KEY:
            analytics.track(api_user.id, "Updated Memory Database")
        data = await prisma.memorydb.update(
            where={"id": memory_db_id},
            data={
                **body.dict(exclude_unset=True),
                "apiUserId": api_user.id,
                "options": Json(body.options),
            },
        )
        data.options = json.dumps(data.options)
        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)
