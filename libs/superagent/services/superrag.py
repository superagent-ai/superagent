from typing import Optional

import requests
from decouple import config


class SuperRagService:
    def __init__(self, url: Optional[str] = None):
        self.url = url or config("SUPERRAG_API_URL")

        if not self.url:
            raise ValueError("SUPERRAG_API_URL is not set")

    def _request(self, method, endpoint, data):
        return requests.request(method, f"{self.url}/{endpoint}", json=data).json()

    def ingest(self, data):
        return self._request(
            "POST",
            "ingest",
            data,
        )

    def delete(self, data):
        return self._request("DELETE", "delete", data)

    def query(self, data):
        return self._request(
            "POST",
            "query",
            data,
        )
