from fastapi import APIRouter, Depends

from app.models.response import ApiUser as ApiUserResponse
from app.utils.api import generate_jwt, get_current_api_user, handle_exception
from app.utils.prisma import prisma

router = APIRouter()


@router.post(
    "/api-users",
    name="create",
    description="Create a new API user",
    response_model=ApiUserResponse,
)
async def create():
    """Endpoint for creating an agent"""
    try:
        api_user = await prisma.apiuser.create({})
        token_data = {
            "api_user_id": api_user.id,
        }
        token = generate_jwt(token_data)
        data = await prisma.apiuser.update(
            where={"id": api_user.id}, data={"token": token}
        )

        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)


@router.get(
    "/api-users/me",
    name="get",
    description="Get a single api user",
    response_model=ApiUserResponse,
)
async def get(api_user=Depends(get_current_api_user)):
    """Endpoint for getting a single api user"""
    try:
        return {"success": True, "data": api_user}
    except Exception as e:
        handle_exception(e)


@router.delete(
    "/api-users/me",
    name="delete",
    description="Delete an api user",
    response_model=None,
)
async def delete(api_user=Depends(get_current_api_user)):
    """Endpoint for deleting an api user"""
    try:
        await prisma.apiuser.delete(where={"id": api_user.id})
        return {"success": True, "data": None}
    except Exception as e:
        handle_exception(e)


# Add an endpoint for regenerating token
