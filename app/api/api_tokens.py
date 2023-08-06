import logging

from fastapi import APIRouter, Depends, HTTPException, status

from app.lib.api_tokens import generate_api_token
from app.lib.auth.prisma import JWTBearer
from app.lib.models.api_token import ApiToken
from app.lib.prisma import prisma

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post(
    "/api-tokens", name="Create API token", description="Create a new API token"
)
async def create_api_token(body: ApiToken, token=Depends(JWTBearer())):
    """Create api token endpoint"""
    api_token = generate_api_token()
    try:
        agent = prisma.apitoken.create(
            {
                "description": body.description,
                "token": api_token,
                "userId": token["userId"],
            },
            include={"user": True},
        )

        return {"success": True, "data": agent}

    except Exception as e:
        logger.error("Cannot create api token", exc_info=e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@router.get("/api-tokens", name="List API tokens", description="List all API tokens")
async def read_api_tokens(token=Depends(JWTBearer())):
    """List api tokens endpoint"""
    try:
        api_tokens = prisma.apitoken.find_many(
            where={"userId": token["userId"]}, include={"user": True}
        )
        return {"success": True, "data": api_tokens}

    except Exception as e:
        logger.error("Error finding api tokens for user {userId}", exc_info=e)

    logger.error("Couldn't find api tokens")
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="No agents found",
    )


@router.get(
    "/api-tokens/{tokenId}",
    name="Get API token",
    description="Get a specific API token",
)
async def read_api_token(tokenId: str, token=Depends(JWTBearer())):
    """Get an api token endpoint"""

    try:
        api_token = prisma.apitoken.find_unique(
            where={"id": tokenId}, include={"user": True}
        )
        return {"success": True, "data": api_token}
    except Exception as e:
        logger.error("Cannot find api token {tokenId}", exc_info=e)

    logger.error("Cannot find api token {tokenId}")
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail=f"API token with id: {tokenId} not found",
    )


@router.delete(
    "/api-tokens/{tokenId}",
    name="Delete API token",
    description="Delete a specific API token",
)
async def delete_api_token(tokenId: str, token=Depends(JWTBearer())):
    """Delete api token endpoint"""
    try:
        prisma.apitoken.delete(where={"id": tokenId})

        return {"success": True, "data": None}
    except Exception as e:
        logger.error(f"Couldn't delete api token with id {tokenId}", exc_info=e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
