import asyncio
import requests

from langchain_community.tools import BaseTool


class AdvancedScraper(BaseTool):
    name = "AdvancedScraper"
    description = "useful for quickly and easily extracting content from a webpage (uses a real browser via Olostep)"
    return_direct = False

    def _run(self, url: str, format: str = "markdown") -> str:

        endpoint = "https://agent.olostep.com/olostep-p2p-incomingAPI"
        headers = {"Authorization": "Bearer " + self.metadata.get("apiKey")}

        if format == "markdown":
            saveHtml = False
            saveMarkdown = True
            expandHtml = False
            expandMarkdown = True
        else:
            saveHtml = True
            saveMarkdown = False
            expandHtml = True
            expandMarkdown = False

        # for more details look at => https://docs.olostep.com/api-reference/start-agent
        querystring = {
            "url": url,
            "saveHtml": saveHtml,
            "saveMarkdown": saveMarkdown,
            "expandHtml": expandHtml,
            "expandMarkdown": expandMarkdown,
            "waitBeforeScraping": 1,
            "fastLane": True,
            "removeCSSselectors": "default",
            "timeout": 45
        }

        response = requests.get(endpoint, headers=headers, params=querystring)
        if format=="markdown":
            return response.json().get("markdown_content")
        else:
            return response.json().get("html_content")

    async def _arun(self, url: str, format: str = "markdown") -> str:
        loop = asyncio.get_event_loop()
        response_text = await loop.run_in_executor(None, self._run, url, format)
        return response_text
