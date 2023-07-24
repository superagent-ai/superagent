from fastapi import APIRouter, Depends, HTTPException, status

from app.lib.auth.prisma import JWTBearer, decodeJWT
from app.lib.prisma import prisma

router = APIRouter()


@router.get("/users/me")
async def read_user_me(token=Depends(JWTBearer())):
    is_oauth_token = False
    if type(token) != str and token["isOauthToken"] == True:
        is_oauth_token = True

    if is_oauth_token != True:
        decoded = decodeJWT(token)
    else:
        decoded = token

    if "userId" in decoded:
        userId = decoded["userId"]
        user = prisma.user.find_unique(where={"id": userId}, include={"profile": True})

        return {"success": True, "data": user}

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"User with id {userId} not found",
    )


@router.get("/users/{userId}")
async def read_user(userId: str):
    user = prisma.user.find_unique(where={"id": userId}, include={"profile": True})

    if user:
        return {"success": True, "data": user}

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"User with id {userId} not found",
    )
