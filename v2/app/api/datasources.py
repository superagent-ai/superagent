from fastapi import APIRouter, Depends
from app.utils.prisma import prisma
from app.utils.api import handle_exception, get_current_api_user
from app.utils.prisma import prisma
from app.utils.api import handle_exception
from app.utils.datasource import finetune
from app.models.response import (
    Datasource as DatasourceResponse,
    DatasourceList as DatasourceListResponse,
)
from app.models.request import Datasource as DatasourceRequest

router = APIRouter()


@router.post(
    "/datasources",
    name="create",
    description="Create a new datasource",
    response_model=DatasourceResponse,
)
async def create(body: DatasourceRequest, api_user=Depends(get_current_api_user)):
    """Endpoint for creating an datasource"""
    try:
        data = await prisma.datasource.create({**body.dict(), "apiUserId": api_user.id})
        finetune(datasource=data)
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
        data = await prisma.datasource.find_unique(
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
        data = await prisma.datasource.update(
            where={"id": datasource_id, "apiUserId": api_user.id},
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
        await prisma.datasource.delete(
            where={"id": datasource_id, "apiUserId": api_user.id}
        )
        return {"success": True}
    except Exception as e:
        handle_exception(e)
