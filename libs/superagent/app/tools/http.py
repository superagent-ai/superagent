import json

import aiohttp
import requests
from langchain_community.tools import BaseTool as LCBaseTool

from app.utils.helpers import get_first_non_null

supported_methods = ["GET", "POST", "PUT", "PATCH", "DELETE"]


class LCHttpTool(LCBaseTool):
    name = "API Request"
    description = "useful for making GET/POST API requests"
    return_direct = False

    def _run(self, body: dict = None) -> None:
        headers = self.metadata.get("headers")
        if isinstance(headers, str):
            headers = json.loads(headers)
        elif headers is None:
            headers = {}
        headers["content-type"] = "application/json"

        try:
            url = get_first_non_null(
                self.metadata.get("url"),
                self.metadata.get("defaultURL"),
            )

            method = get_first_non_null(
                self.metadata.get("method"),
                self.metadata.get("defaultMethod"),
            )
            if method not in supported_methods:
                method = self.metadata.get("defaultMethod", "GET")

            if body is None:
                body = self.metadata.get("defaultBody", {})

            request_kwargs = {"method": method, "url": url, "headers": headers}
            if body is not None:
                request_kwargs["json"] = body
            response = requests.request(**request_kwargs)
            response.raise_for_status()
            try:
                return response.json()
            except Exception:
                return "Request successful"
        except requests.exceptions.RequestException as e:
            return str(e)

    async def _arun(self, body: dict = None) -> str:
        headers = self.metadata.get("headers")
        if isinstance(headers, str):
            headers = json.loads(headers)
        elif headers is None:
            headers = {}
        headers["content-type"] = "application/json"

        url = get_first_non_null(
            self.metadata.get("url"),
            self.metadata.get("defaultURL"),
        )

        method = get_first_non_null(
            self.metadata.get("method"),
            self.metadata.get("defaultMethod"),
        )

        try:
            if method not in supported_methods:
                method = self.metadata.get("defaultMethod", "GET")

            if body is None:
                body = self.metadata.get("defaultBody", {})

            async with aiohttp.ClientSession() as session:
                request_kwargs = {"method": method, "url": url, "headers": headers}
                if body is not None:
                    request_kwargs["json"] = body
                async with session.request(**request_kwargs) as response:
                    try:
                        return await response.json()
                    except Exception:
                        return "Request successfull"
        except Exception as e:
            return str(e)
