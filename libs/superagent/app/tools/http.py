import aiohttp
import requests
from pydantic import BaseModel, Field

from app.tools.base import BaseTool


class HTTPRequestArgs(BaseModel):
    url: str = Field(..., description="URL for the HTTP request")
    method: str = Field(
        "GET", description="HTTP method like GET or POST", regex="^(GET|POST)$"
    )
    headers: dict = Field(default={})
    body: dict = Field(default={})


class HTTP(BaseTool):
    name = "HTTP"
    description = "Useful for sending HTTP requests."
    return_direct = False
    args_schema = HTTPRequestArgs

    async def arun(self, args: HTTPRequestArgs) -> dict:
        try:
            async with aiohttp.ClientSession() as session:
                async with session.request(
                    args.method, args.url, headers=args.headers, json=args.body
                ) as response:
                    return await response.json()
        except Exception as e:
            return {"error": str(e)}

    def _run(self, args: HTTPRequestArgs) -> dict:
        try:
            response = requests.request(
                args.method, args.url, headers=args.headers, json=args.body
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"error": str(e)}
