import json

from langchain_community.tools import BaseTool


class HandOff(BaseTool):
    name = "human hand-off"
    description = "useful for hand-off of conversation to a human operator"
    return_direct = False

    def _run(self, reason: str) -> str:
        payload = {"reasons": reason, "action": "hand-off"}
        return json.dumps(payload)

    async def _arun(self, reason: str) -> str:
        payload = {"reasons": reason, "action": "hand-off"}
        return json.dumps(payload)
