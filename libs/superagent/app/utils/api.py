import logging

import jwt
from decouple import config
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.utils.prisma import prisma

logger = logging.getLogger(__name__)
security = HTTPBearer()


def handle_exception(e):
    logger.exception(e)
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
    )


def generate_jwt(data: dict):
    token = jwt.encode({**data}, config("JWT_SECRET"), algorithm="HS256")
    return token


def decode_jwt(token: str):
    return jwt.decode(token, config("JWT_SECRET"), algorithms=["HS256"])


async def get_current_api_user(
    authorization: HTTPAuthorizationCredentials = Security(security),
):
    token = authorization.credentials
    decoded_token = decode_jwt(token)
    api_user = await prisma.apiuser.find_unique(
        where={"id": decoded_token.get("api_user_id")}
    )
    if not api_user:
        raise HTTPException(status_code=401, detail="Invalid token or expired token")
    return api_user
