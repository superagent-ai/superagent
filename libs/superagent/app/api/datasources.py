import asyncio
import json
from typing import Optional

import segment.analytics as analytics
from decouple import config
from fastapi import APIRouter, Depends, HTTPException

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
from prisma.enums import DatasourceStatus, VectorDbProvider
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
        vector_db = None
        if body.vectorDbProvider is not None:
            # checking provided vector db provider is valid or not
            vector_db_provider = None
            for provider in VectorDbProvider:
                if provider.value == body.vectorDbProvider:
                    vector_db_provider = provider
                    break
            if not vector_db_provider:
                raise HTTPException(
                    status_code=400, detail="Invalid vector database provider!"
                )

            vector_db = await prisma.vectordb.find_first(
                where={"provider": vector_db_provider, "apiUserId": api_user.id}
            )
        if body.metadata:
            body.metadata = json.dumps(body.metadata)

        if SEGMENT_WRITE_KEY:
            analytics.track(api_user.id, "Created Datasource")

        data = await prisma.datasource.create(
            {
                # not passing vectorDbProvider
                # since datasource table doesn't have that column
                "apiUserId": api_user.id,
                **body.dict(exclude={"vectorDbProvider"}),
                "vectorDbId": vector_db.id if vector_db is not None else None,
            }
        )

        async def run_vectorize_flow(
            datasource: Datasource,
            options: Optional[dict],
            vector_db_provider: Optional[str],
        ):
            try:
                await vectorize_datasource(
                    datasource=datasource,
                    # vector db configurations (api key, index name etc.)
                    options=options,
                    vector_db_provider=vector_db_provider,
                )
            except Exception as flow_exception:
                await prisma.datasource.update(
                    where={"id": datasource.id},
                    data={"status": DatasourceStatus.FAILED},
                )
                handle_exception(flow_exception)

        asyncio.create_task(
            run_vectorize_flow(
                datasource=data,
                options=vector_db.options if vector_db is not None else {},
                vector_db_provider=vector_db.provider
                if vector_db is not None
                else None,
            )
        )
        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)


@router.get(
    "/datasources",
    name="list",
    description="List all datasources",
    response_model=DatasourceListResponse,
)
async def list(api_user=Depends(get_current_api_user), skip: int = 0, take: int = 50):
    """Endpoint for listing all datasources"""
    try:
        import math

        data = await prisma.datasource.find_many(
            skip=skip,
            take=take,
            where={"apiUserId": api_user.id},
            order={"createdAt": "desc"},
        )

        # Get the total count of datasources
        total_count = await prisma.datasource.count(where={"apiUserId": api_user.id})

        # Calculate the total number of pages
        total_pages = math.ceil(total_count / take)

        return {"success": True, "data": data, "total_pages": total_pages}
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
        datasource = await prisma.datasource.find_first(
            where={"id": datasource_id}, include={"vectorDb": True}
        )
        options = datasource.vectorDb.options
        vector_db_provider = datasource.vectorDb.provider

        await prisma.agentdatasource.delete_many(where={"datasourceId": datasource_id})
        await prisma.datasource.delete(where={"id": datasource_id})

        async def run_delete_datasource_flow(
            datasource_id: str, options: dict, vector_db_provider: str
        ) -> None:
            try:
                await delete_datasource(
                    datasource_id=datasource_id,
                    options=options,
                    vector_db_provider=vector_db_provider,
                )
            except Exception as flow_exception:
                handle_exception(flow_exception)

        asyncio.create_task(
            run_delete_datasource_flow(
                datasource_id=datasource_id,
                options=options,
                vector_db_provider=vector_db_provider,
            )
        )
        return {"success": True, "data": None}
    except Exception as e:
        handle_exception(e)
