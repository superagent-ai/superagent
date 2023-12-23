import aiohttp
import requests
from pydantic import BaseModel, Field

from app.tools.base import BaseTool


class HTTPRequestArgs(BaseModel):
    url: str = Field(..., description="URL for the HTTP request")
    method: str = Field(default="GET", description="HTTP method like GET or POST")
    headers: dict = Field(default={})
    body: dict = Field(default={})


class HTTP(BaseTool):
    name = "HTTP"
    description = "useful sending post/get requests."
    return_direct = False

    args_schema = HTTPRequestArgs

    async def arun(self, args: HTTPRequestArgs) -> dict:
        async with aiohttp.ClientSession() as session:
            async with session.request(args.method, args.url, headers=args.headers, json=args.body) as response:
                return await response.json()

    def _run(self, args: HTTPRequestArgs) -> dict:
        response = requests.request(args.method, args.url, headers=args.headers, json=args.body)
        return response.json()
