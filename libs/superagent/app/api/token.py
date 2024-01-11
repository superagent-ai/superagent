import json

import segment.analytics as analytics
from decouple import config
from fastapi import APIRouter, Depends, HTTPException
from app.models.request import ApiToken as ApiTokenRequest
from app.models.request import ApiTokenUpdate as ApiTokenUpdateRequest

from app.models.response import ApiToken as ApiTokenResponse
from app.models.response import GetToken as GetTokenResponse

from app.utils.api import get_current_api_user, handle_exception
from app.utils.prisma import prisma

SEGMENT_WRITE_KEY = config("SEGMENT_WRITE_KEY", None)

router = APIRouter()
analytics.write_key = SEGMENT_WRITE_KEY


@router.post(
    "/token",
    name="create",
    description="Create a new Token",
    response_model=ApiTokenResponse,
)
async def create(body: ApiTokenRequest,  api_user=Depends(get_current_api_user)):
    try:
        token_data = {
            'agentToken': body.agentToken,
            'userToken': body.userToken,
            'apiUserId': api_user.id,
            'apiUserChatwoot': body.apiUserChatwoot,
            'isAgentActive': body.isAgentActive
        }
        await prisma.token.create(data=token_data)
        response_data = {
            'success': True,
            'message': "Token Successfully Created",
            'data': token_data
        }
        if SEGMENT_WRITE_KEY:
            analytics.track(api_user.id, "Token Created", token_data)
    except Exception as e:
        response_data = {
            'success': False,
            'message': "Failed to process the token",
            'error': str(e)
        }
        if SEGMENT_WRITE_KEY:
            analytics.track(api_user.id, "token_creation_failed", {
                'error': str(e),
                'agentToken': body.agentToken,
                'userToken': body.userToken,
                'apiUserChatwoot': body.apiUserChatwoot
            })

    return ApiTokenResponse(**response_data)

@router.get(
    "/token",
    name="get",
    description="Get a Token",
    response_model=GetTokenResponse,
    responses={404: {"description": "Token not found"}},
)
async def get(api_user=Depends(get_current_api_user)):
    try:
        data = await prisma.token.find_first(
            where={"apiUserId": api_user.id},
        )
        if not data:
            return {"success": False, "message": "Token not found"}
        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)

@router.patch(
    "/token",
    name="update_token",
    description="Update a Token",
    response_model=ApiTokenResponse,
)
async def update_token(
    body: ApiTokenUpdateRequest,
    api_user=Depends(get_current_api_user)
):
    try:
        allowed_fields = {'agentToken', 'userToken'}
        update_data = {field: value for field, value in update_data.items() if field in allowed_fields}
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")

        updated_token = await prisma.token.update(
            where= {"apiUserId": api_user.id},
            data={
                'userToken': body.userToken,
            },
        )
        return {"success": True, "message": "Token successfully updated", "data": updated_token}
    except HTTPException as http_exc:
        # Pass through HTTP exceptions (like our 400 above)
        raise http_exc
    except Exception as e:
        handle_exception(e)
        return {"success": False, "message": "Failed to update the token"}

@router.patch(
    "/token/active",
    name="update_token_active_status",
    description="Update Token Active Status",
    response_model=ApiTokenResponse,
)
async def update_token_active_status(
    body: ApiTokenUpdateRequest,
    api_user=Depends(get_current_api_user)
):
    try:
        update_data = {'isAgentActive': body.isAgentActive}
        updated_token = await prisma.token.update(
            where={"apiUserId": api_user.id},
            data=update_data,
        )
        return {"success": True, "message": "Token active status successfully updated", "data": updated_token}
    except HTTPException as http_exc:
        # Pass through HTTP exceptions
        raise http_exc
    except Exception as e:
        handle_exception(e)
        return {"success": False, "message": "Failed to update the token active status"}

