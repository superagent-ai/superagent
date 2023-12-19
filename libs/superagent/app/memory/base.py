from typing import Any, Dict, List, Optional, Tuple

import requests
from decouple import config

MANAGED_URL = config("MEMORY_API_URL")


class Memory:
    """Assistant memory"""

    def __init__(
        self,
        session_id: str,
        url: str = MANAGED_URL,
        timeout: int = 3000,
        context: Optional[str] = None,
    ):
        self.url = url
        self.timeout = timeout
        self.session_id = session_id
        self.context = context
        self.chat_memory = []

    def __get_headers(self) -> Dict[str, str]:
        headers = {
            "Content-Type": "application/json",
        }
        return headers

    async def init(self) -> Tuple[str, List[Any]]:
        res = requests.get(
            f"{self.url}/sessions/{self.session_id}/memory",
            timeout=self.timeout,
            headers=self.__get_headers(),
        )
        res_data = res.json()
        res_data = res_data.get("data", res_data)
        messages = res_data.get("messages", [])
        context = res_data.get("context", "NONE")
        return (context, list(reversed(messages)))

    def save_context(self, input: str, output: str) -> None:
        requests.post(
            f"{self.url}/sessions/{self.session_id}/memory",
            timeout=self.timeout,
            json={
                "messages": [
                    {"role": "Human", "content": f"{input}"},
                    {"role": "AI", "content": f"{output}"},
                ]
            },
            headers=self.__get_headers(),
        )

    def delete_session(self) -> None:
        """Delete a session"""
        requests.delete(f"{self.url}/sessions/{self.session_id}/memory")
