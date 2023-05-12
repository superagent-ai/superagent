from fastapi import HTTPException, Security
from fastapi.security.api_key import APIKeyHeader
from starlette.status import HTTP_403_FORBIDDEN

from app.lib.prisma import prisma

api_key_header = APIKeyHeader(name="X_SUPERAGENT_API_KEY", auto_error=False)


async def get_api_key(api_key_header: str = Security(api_key_header)):
    try:
        await prisma.apitoken.find_first(where={"token": api_key_header})

        return api_key_header

    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=HTTP_403_FORBIDDEN, detail="Could not validate API KEY"
        )
