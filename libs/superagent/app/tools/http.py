import json
import logging

import aiohttp
import requests
from langchain_community.tools import BaseTool as LCBaseTool

from app.utils.helpers import get_first_non_null

supported_methods = ["GET", "POST", "PUT", "PATCH", "DELETE"]


logger = logging.getLogger(__name__)


class LCHttpTool(LCBaseTool):
    name = "API Request"
    description = "useful for making GET/POST API requests"
    return_direct = False

    def _run(self, body: dict = None) -> None:
        headers = self.metadata.get("headers") or "{}"
        headers = json.loads(headers)
        headers["content-type"] = "application/json"

        url = get_first_non_null(
            self.metadata.get("url"),
            self.metadata.get("defaultURL"),
        )

        method = get_first_non_null(
            self.metadata.get("method"),
            self.metadata.get("defaultMethod"),
        )
        if method not in supported_methods:
            logger.warning(f"Method {method} not supported. Defaulting to GET method")
            method = "GET"

        if body is None:
            logger.debug("No body provided. Using default body")
            body = self.metadata.get("defaultBody", {})

        try:
            response = requests.request(
                method=method, url=url, headers=headers, json=body
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return f"Request failed: {str(e)}"

    async def _arun(self, body: dict = None) -> None:
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

        if method not in supported_methods:
            logger.warning(f"Method {method} not supported. Defaulting to GET method")
            method = "GET"

        if body is None:
            logger.debug("No body provided. Using default body")
            body = self.metadata.get("defaultBody", {})

        try:
            async with aiohttp.ClientSession() as session:
                # TODO: add timeout
                async with session.request(
                    method=method, url=url, headers=headers, json=body
                ) as response:
                    response.raise_for_status()
                    return await response.json()
        except Exception as e:
            return f"Request failed: {str(e)}"
