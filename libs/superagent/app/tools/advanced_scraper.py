import asyncio
import requests

from langchain_community.tools import BaseTool
#from Olostep import OlostepClient


class AdvancedScraper(BaseTool):
    name = "AdvancedScraper"
    description = "useful for quickly and easily extracting content from a webpage"
    return_direct = False

    def _run(self, url: str) -> str:

        url = "https://agent.olostep.com/olostep-p2p-incomingAPI"
        headers = {"Authorization": "Bearer <token>"}

        #for more details look at => https://docs.olostep.com/api-reference/start-agent
        querystring = {
            "url": "https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping",
            "expandHtml":"true",
            "expandMarkdown": "false",
            "waitBeforeScraping": 0
        }

        response = requests.request("GET", url, headers=headers, params=querystring)
        return response.text

    async def _arun(self, url: str) -> str:
        loop = asyncio.get_event_loop()
        response_text = await loop.run_in_executor(None, self._run, url)
        return response_text
