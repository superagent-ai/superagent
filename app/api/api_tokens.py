from fastapi import APIRouter, Depends, HTTPException, status

from app.lib.api_tokens import generate_api_token
from app.lib.auth.prisma import JWTBearer, decodeJWT
from app.lib.models.api_token import ApiToken
from app.lib.prisma import prisma

router = APIRouter()


@router.post(
    "/api-tokens/", name="Create API token", description="Create a new API token"
)
async def create_api_token(body: ApiToken, token=Depends(JWTBearer())):
    """Create api token endpoint"""
    decoded = decodeJWT(token)
    token = generate_api_token()

    try:
        agent = await prisma.apitoken.create(
            {
                "description": body.description,
                "token": token,
                "userId": decoded["userId"],
            },
            include={"user": True},
        )

        return {"success": True, "data": agent}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e,
        )


@router.get("/api-tokens/", name="List API tokens", description="List all API tokens")
async def read_api_tokens(token=Depends(JWTBearer())):
    """List api tokens endpoint"""
    decoded = decodeJWT(token)
    api_tokens = await prisma.apitoken.find_many(
        where={"userId": decoded["userId"]}, include={"user": True}
    )

    if api_tokens:
        return {"success": True, "data": api_tokens}

    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="No agents found",
    )


@router.get(
    "/api-tokens/{tokenId}",
    name="Get API token",
    description="Get a specific API token",
)
async def read_agent(tokenId: str, token=Depends(JWTBearer())):
    """Get an api token endpoint"""
    api_token = await prisma.apitoken.find_unique(
        where={"id": tokenId}, include={"user": True}
    )

    if api_token:
        return {"success": True, "data": api_token}

    raise HTTPException(
        status_code=status.HTTP_404_INTERNAL_SERVER_ERROR,
        detail=f"API token with id: {tokenId} not found",
    )


@router.delete(
    "/api-tokens/{tokenId}",
    name="Delete API token",
    description="Delete a specific API token",
)
async def delete_api_token(tokenId: str, token=Depends(JWTBearer())):
    """Deleta api token endpoint"""
    try:
        await prisma.apitoken.delete(where={"id": tokenId})

        return {"success": True, "data": None}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_INTERNAL_SERVER_ERROR,
            detail=e,
        )
