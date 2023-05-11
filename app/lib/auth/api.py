from decouple import config
from fastapi import HTTPException, Security
from fastapi.security.api_key import APIKeyHeader
from starlette.status import HTTP_403_FORBIDDEN

api_key_header = APIKeyHeader(name="X_SUPERAGENT_API_KEY", auto_error=False)


async def get_api_key(api_key_header: str = Security(api_key_header)):
    if api_key_header == config("API_KEY"):
        return api_key_header
    else:
        raise HTTPException(
            status_code=HTTP_403_FORBIDDEN, detail="Could not validate API KEY"
        )
