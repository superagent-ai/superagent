import asyncio

import requests
from langchain_community.tools import BaseTool


class AdvancedScraper(BaseTool):
    name = "AdvancedScraper"
    description = "useful for quickly and easily extracting content from a webpage (uses a real browser via Olostep)"
    return_direct = False

    def _run(self, url: str) -> str:
        endpoint = "https://agent.olostep.com/olostep-p2p-incomingAPI"
        headers = {"Authorization": "Bearer " + self.metadata.get("apiKey")}

        # for more details look at => https://docs.olostep.com/api-reference/start-agent
        querystring = {
            "url": url,
            "saveMarkdown": True,
            "expandMarkdown": True,
            "waitBeforeScraping": 1,
            "fastLane": True,
            "removeCSSselectors": "default",
            "timeout": 45,
        }

        response = requests.get(endpoint, headers=headers, params=querystring)
        return response.json().get("markdown_content")

    async def _arun(self, url: str) -> str:
        loop = asyncio.get_event_loop()
        response_text = await loop.run_in_executor(None, self._run, url)
        return response_text
