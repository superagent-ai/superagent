import json

from langchain.tools import BaseTool


class Function(BaseTool):
    name = "cunstom function"
    description = "useful for doing something"
    return_direct = False

    def _run(self, config: dict) -> str:
        payload = {"args": config.args, "action": config.name}
        return json.dumps(payload)

    async def _arun(self, config: dict) -> str:
        payload = {"args": config.args, "action": config.name}
        return json.dumps(payload)
