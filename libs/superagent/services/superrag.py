from typing import Optional

import requests
from decouple import config


class SuperRagService:
    def __init__(self, url: Optional[str] = None):
        self.url = url or config("SUPERRAG_API_URL")

        if not self.url:
            raise ValueError("SUPERRAG_API_URL is not set")

    def ingest(self, data):
        res = requests.post(f"{self.url}/ingest", json=data)
        return res.json()

    def query(self, data):
        res = requests.post(f"{self.url}/query", json=data)
        return res.json()

    def delete(self, data):
        res = requests.delete(f"{self.url}/delete", json=data)
        return res.json()
