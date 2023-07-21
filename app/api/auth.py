import json

from fastapi import APIRouter, HTTPException, status

from app.lib.auth.prisma import (
    encryptPassword,
    signJWT,
    validatePassword,
)
from app.lib.models.auth import OAuth, SignIn, SignInOut, SignUp
from app.lib.prisma import prisma

router = APIRouter()


@router.post("/auth/sign-in")
async def sign_in(signIn: SignIn):
    user = prisma.user.find_first(
        where={
            "email": signIn.email,
        },
        include={"profile": True},
    )
    if user:
        validated = validatePassword(signIn.password, user.password)
        del user.password

        if validated:
            token = signJWT(user.id)
            return {"success": True, "data": SignInOut(token=token, user=user)}

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )


@router.post("/auth/sign-up")
async def sign_up(body: SignUp):
    encryptPassword(body.password)
    user = prisma.user.create(
        {
            "email": body.email,
            "password": encryptPassword(body.password),
            "name": body.name,
        }
    )
    prisma.profile.create({"userId": user.id, "metadata": json.dumps(body.metadata)})

    if user:
        return {"success": True, "data": user}

    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Invalid credentials",
    )

@router.post("/auth/oauth/callback")
async def oauth_handler(body: OAuth):
    user = prisma.user.find_first(
        where={
            "email": body.email,
        },
        include={"profile": True},
    )
    prisma.user.update(
        where={
            "email": body.email
        },
        data={
            "email": body.email,
            "provider": body.provider,
            "name": body.name,
            "accessToken": body.access_token
        },
    )
    if user:
        return { "success": True, "data": user}
    else:
        user = prisma.user.create(
            {
                "email": body.email,
                "provider": body.provider,
                "name": body.name,
                "accessToken": body.access_token
            }
        )
        prisma.profile.create({"userId": user.id, "metadata": json.dumps(body.metadata)})
        
        if user:
            return { "success": True, "data": user}
    