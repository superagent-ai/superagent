from fastapi import HTTPException, Security
from fastapi.security.api_key import APIKeyHeader
from starlette.status import HTTP_403_FORBIDDEN

from app.lib.prisma import prisma

api_key_header = APIKeyHeader(name="X_SUPERAGENT_API_KEY", auto_error=False)
bearer_token_header = APIKeyHeader(name="Authorization", auto_error=False)


async def get_api_key(
    api_key_header: str = Security(api_key_header),
    bearer_token_header: str = Security(bearer_token_header),
):
    api_key = api_key_header or bearer_token_header.replace("Bearer ", "")
    try:
        prisma.apitoken.find_first(where={"token": api_key})

        return api_key

    except Exception as e:
        raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail=str(e))
