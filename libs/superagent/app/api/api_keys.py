import segment.analytics as analytics
from decouple import config
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from app.models.request import ApiKey as ApiKeyRequest
from app.models.response import ApiKey as ApiKeyResponse
from app.models.response import ApiKeyCreate as ApiKeyCreateResponse
from app.models.response import ApiKeyList as ApiKeyListResponse
from app.utils.api import generate_jwt, get_current_api_user, handle_exception
from app.utils.prisma import prisma

SEGMENT_WRITE_KEY = config("SEGMENT_WRITE_KEY", None)

router = APIRouter()
analytics.write_key = SEGMENT_WRITE_KEY


def get_display_api_key(key: str):
    return f"{key[:3]}****{key[-4:]}"


@router.post(
    "/api-keys",
    name="create",
    description="Create a new API key",
    response_model=ApiKeyCreateResponse,
)
async def create(body: ApiKeyRequest, api_user=Depends(get_current_api_user)):
    """Endpoint for creating an agent"""
    try:
        api_key = generate_jwt(
            {
                "api_user_id": api_user.id,
            }
        )

        display_api_key = get_display_api_key(api_key)

        api_key_data = await prisma.apikey.create(
            {
                "name": body.name,
                "displayApiKey": display_api_key,
                "apiUserId": api_user.id,
            }
        )
        if SEGMENT_WRITE_KEY:
            analytics.track(api_user.id, "API Key Created", {"api_key": api_key})

        return {
            "success": True,
            "data": {
                **api_key_data.dict(),
                "apiKey": api_key,
            },
        }
    except Exception as e:
        handle_exception(e)


@router.delete(
    "/api-keys/{id}",
    name="delete",
    description="Delete an API key",
    response_model=ApiKeyResponse,
)
async def delete(id: str, api_user=Depends(get_current_api_user)):
    """Endpoint for deleting an agent"""
    try:
        api_key = await prisma.apikey.find_unique(where={"id": id})
        if not api_key:
            raise Exception("API Key not found")

        await prisma.apikey.delete(
            where={
                "id": id,
                "apiUserId": api_user.id,
            }
        )
        if SEGMENT_WRITE_KEY:
            analytics.track(
                api_user.id,
                "API Key Deleted",
            )

        return {"success": True, "data": api_key}
    except Exception as e:
        handle_exception(e)


@router.get(
    "/api-keys",
    name="list",
    description="List API keys",
    response_model=ApiKeyListResponse,
)
async def list(api_user=Depends(get_current_api_user)):
    """Endpoint for listing all agents"""
    try:
        api_keys = await prisma.apikey.find_many(
            where={
                "apiUserId": api_user.id,
            }
        )

        return {
            "success": True,
            "data": api_keys,
        }
    except Exception as e:
        handle_exception(e)


@router.patch(
    "/api-keys/{id}",
    name="update",
    description="Update an API key",
    response_model=ApiKeyResponse,
)
async def update(id: str, body: ApiKeyRequest, api_user=Depends(get_current_api_user)):
    """Endpoint for updating an agent"""
    try:
        api_key = await prisma.apikey.find_unique(
            where={"id": id, "apiUserId": api_user.id}
        )
        if not api_key:
            return JSONResponse(
                status_code=404,
                content={"success": False, "error": {"message": "API Key not found"}},
            )

        api_key = await prisma.apikey.update(
            where={"id": id},
            data={
                **body.dict(exclude_unset=True),
            },
        )

        return {"success": True, "data": api_key}
    except Exception as e:
        handle_exception(e)
