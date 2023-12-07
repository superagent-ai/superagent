import asyncio
import json

import segment.analytics as analytics
from decouple import config
from fastapi import APIRouter, Depends

from app.datasource.flow import delete_datasource, vectorize_datasource
from app.models.request import Datasource as DatasourceRequest
from app.models.response import (
    Datasource as DatasourceResponse,
)
from app.models.response import (
    DatasourceList as DatasourceListResponse,
)
from app.utils.api import get_current_api_user, handle_exception
from app.utils.prisma import prisma
from prisma.models import Datasource

SEGMENT_WRITE_KEY = config("SEGMENT_WRITE_KEY", None)

router = APIRouter()
analytics.write_key = SEGMENT_WRITE_KEY


@router.post(
    "/datasources",
    name="create",
    description="Create a new datasource",
    response_model=DatasourceResponse,
)
async def create(
    body: DatasourceRequest,
    api_user=Depends(get_current_api_user),
):
    """Endpoint for creating an datasource"""
    try:
        if body.metadata:
            body.metadata = json.dumps(body.metadata)

        if SEGMENT_WRITE_KEY:
            analytics.track(api_user.id, "Created Datasource")
        data = await prisma.datasource.create({**body.dict(), "apiUserId": api_user.id})

        async def run_vectorize_flow(datasource: Datasource):
            try:
                await vectorize_datasource(
                    datasource=datasource,
                )
            except Exception as flow_exception:
                handle_exception(flow_exception)

        asyncio.create_task(run_vectorize_flow(datasource=data))
        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)


@router.get(
    "/datasources",
    name="list",
    description="List all datasources",
    response_model=DatasourceListResponse,
)
async def list(api_user=Depends(get_current_api_user)):
    """Endpoint for listing all datasources"""
    try:
        data = await prisma.datasource.find_many(
            where={"apiUserId": api_user.id}, order={"createdAt": "desc"}
        )
        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)


@router.get(
    "/datasources/{datasource_id}",
    name="get",
    description="Get a specific datasource",
    response_model=DatasourceResponse,
)
async def get(datasource_id: str, api_user=Depends(get_current_api_user)):
    """Endpoint for getting a specific datasource"""
    try:
        data = await prisma.datasource.find_first(
            where={"id": datasource_id, "apiUserId": api_user.id}
        )
        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)


@router.patch(
    "/datasources/{datasource_id}",
    name="update",
    description="Update a specific datasource",
    response_model=DatasourceResponse,
)
async def update(
    datasource_id: str, body: DatasourceRequest, api_user=Depends(get_current_api_user)
):
    """Endpoint for updating a specific datasource"""
    try:
        if SEGMENT_WRITE_KEY:
            analytics.track(api_user.id, "Updated Datasource")
        data = await prisma.datasource.update(
            where={"id": datasource_id},
            data=body.dict(),
        )
        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)


@router.delete(
    "/datasources/{datasource_id}",
    name="delete",
    description="Delete a specific datasource",
)
async def delete(datasource_id: str, api_user=Depends(get_current_api_user)):
    """Endpoint for deleting a specific datasource"""
    try:
        if SEGMENT_WRITE_KEY:
            analytics.track(api_user.id, "Deleted Datasource")
        await prisma.agentdatasource.delete_many(where={"datasourceId": datasource_id})
        await prisma.datasource.delete(where={"id": datasource_id})

        async def run_delete_datasource_flow(datasource_id: str) -> None:
            try:
                await delete_datasource(
                    datasource_id=datasource_id,
                )
            except Exception as flow_exception:
                handle_exception(flow_exception)

        asyncio.create_task(run_delete_datasource_flow(datasource_id=datasource_id))
        return {"success": True, "data": None}
    except Exception as e:
        handle_exception(e)
