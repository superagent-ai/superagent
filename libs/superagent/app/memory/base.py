from typing import Any, Dict, List, Optional

import requests

from decouple import config

MANAGED_URL = config("MEMORY_API_URL")


class Memory:
    """Assistant memory"""

    url: str = MANAGED_URL
    timeout: int = 3000
    memory_key: str = "history"
    session_id: str
    context: Optional[str] = None

    def __get_headers(self) -> Dict[str, str]:
        headers = {
            "Content-Type": "application/json",
        }
        return headers

    async def init(self) -> None:
        res = requests.get(
            f"{self.url}/sessions/{self.session_id}/memory",
            timeout=self.timeout,
            headers=self.__get_headers(),
        )
        res_data = res.json()
        res_data = res_data.get("data", res_data)  # Handle Managed Version

        messages = res_data.get("messages", [])
        context = res_data.get("context", "NONE")

        for message in reversed(messages):
            if message["role"] == "AI":
                self.chat_memory.add_ai_message(message["content"])
            else:
                self.chat_memory.add_user_message(message["content"])

        if context and context != "NONE":
            self.context = context

    def save_context(self, inputs: Dict[str, Any], outputs: Dict[str, str]) -> None:
        input_str, output_str = self._get_input_output(inputs, outputs)
        requests.post(
            f"{self.url}/sessions/{self.session_id}/memory",
            timeout=self.timeout,
            json={
                "messages": [
                    {"role": "Human", "content": f"{input_str}"},
                    {"role": "AI", "content": f"{output_str}"},
                ]
            },
            headers=self.__get_headers(),
        )
        super().save_context(inputs, outputs)

    def delete_session(self) -> None:
        """Delete a session"""
        requests.delete(f"{self.url}/sessions/{self.session_id}/memory")
