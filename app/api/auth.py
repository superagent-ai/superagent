import json

from fastapi import APIRouter, HTTPException, status

from app.lib.auth.prisma import (
    encryptPassword,
    signJWT,
    validatePassword,
)
from app.lib.models.auth import SignIn, SignInOut, SignUp
from app.lib.prisma import prisma

router = APIRouter()


@router.post("/auth/sign-in")
def sign_in(signIn: SignIn):
    user = prisma.user.find_first(
        where={
            "email": signIn.email,
        },
        include={"profile": True},
    )
    validated = validatePassword(signIn.password, user.password)
    del user.password

    if validated:
        token = signJWT(user.id)
        return {"success": True, "data": SignInOut(token=token, user=user)}

    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Invalid credentials",
    )


@router.post("/auth/sign-up")
def sign_up(body: SignUp):
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
