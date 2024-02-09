import json

import segment.analytics as analytics
from decouple import config
from fastapi import APIRouter, Depends

from app.models.request import VectorDb as VectorDbRequest
from app.models.response import VectorDb as VectorDbResponse
from app.models.response import VectorDbList as VectorDbListResponse
from app.utils.api import get_current_api_user, handle_exception
from app.utils.prisma import prisma
from prisma import Json

SEGMENT_WRITE_KEY = config("SEGMENT_WRITE_KEY", None)

router = APIRouter()
analytics.write_key = SEGMENT_WRITE_KEY


@router.post(
    "/vector-db",
    name="create",
    description="Create a new Vector Database",
    response_model=VectorDbResponse,
)
async def create(body: VectorDbRequest, api_user=Depends(get_current_api_user)):
    """Endpoint for creating a Vector Database"""
    if SEGMENT_WRITE_KEY:
        analytics.track(api_user.id, "Created Vector Database")

    data = await prisma.vectordb.create(
        {
            **body.dict(),
            "apiUserId": api_user.id,
            "options": json.dumps(body.options),
        }
    )
    data.options = json.dumps(data.options)
    return {"success": True, "data": data}


@router.get(
    "/vector-dbs",
    name="list",
    description="List all Vector Databases",
    response_model=VectorDbListResponse,
)
async def list(api_user=Depends(get_current_api_user)):
    """Endpoint for listing all Vector Databases"""
    try:
        data = await prisma.vectordb.find_many(
            where={"apiUserId": api_user.id}, order={"createdAt": "desc"}
        )
        # Convert options to string
        for item in data:
            item.options = json.dumps(item.options)
        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)


@router.get(
    "/vector-dbs/{vector_db_id}",
    name="get",
    description="Get a single Vector Database",
    response_model=VectorDbResponse,
)
async def get(vector_db_id: str, api_user=Depends(get_current_api_user)):
    """Endpoint for getting a single Vector Database"""
    try:
        data = await prisma.vectordb.find_first(
            where={"id": vector_db_id, "apiUserId": api_user.id}
        )
        data.options = json.dumps(data.options)
        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)


@router.patch(
    "/vector-dbs/{vector_db_id}",
    name="update",
    description="Patch a Vector Database",
    response_model=VectorDbResponse,
)
async def update(
    vector_db_id: str, body: VectorDbRequest, api_user=Depends(get_current_api_user)
):
    """Endpoint for patching a Vector Database"""
    try:
        if SEGMENT_WRITE_KEY:
            analytics.track(api_user.id, "Updated Vector Database")
        data = await prisma.vectordb.update(
            where={"id": vector_db_id},
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
