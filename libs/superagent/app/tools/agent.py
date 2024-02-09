import aiohttp
import requests
from langchain_community.tools import BaseTool
from decouple import config

API_BASE_URL = config("SUPERAGENT_API_URL")


class Agent(BaseTool):
    name = "Agent as a Tool"
    description = "useful for answering questions."

    def _run(self, input: str) -> str:
        agent_id = self.metadata["agentId"]
        api_key = self.metadata["apiKey"]
        url = f"{API_BASE_URL}/api/v1/agents/{agent_id}/invoke"
        headers = {
            "content-type": "application/json",
            "authorization": f"Bearer {api_key}",
        }
        data = {"enableStreaming": False, "input": input}
        response = requests.post(url=url, headers=headers, json=data)
        output = response.json()
        return output.get("data")

    async def _arun(self, input: str) -> str:
        session_id = self.metadata["sessionId"]
        agent_id = self.metadata["agentId"]
        api_key = self.metadata["apiKey"]
        url = f"{API_BASE_URL}/api/v1/agents/{agent_id}/invoke"
        headers = {
            "content-type": "application/json",
            "authorization": f"Bearer {api_key}",
        }
        data = {"enableStreaming": False, "input": input, "sessionId": session_id}
        async with aiohttp.ClientSession() as session:
            async with session.post(url=url, headers=headers, json=data) as response:
                output = await response.json()
        return output["data"].get("output")
