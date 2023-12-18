import aiohttp
import requests
from bs4 import BeautifulSoup
from langchain.tools import BaseTool as LCBaseTool
from pydantic import BaseModel, Field

from app.tools.base import BaseTool


class LCBrowser(LCBaseTool):
    name = "Browser"
    description = (
        "a portal to the internet. Use this when you need to "
        "get specific content from a website."
    )
    return_direct = False

    def _run(self, url: str) -> None:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, "html.parser")
        return soup.get_text()

    async def _arun(self, url: str) -> str:
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                html_content = await response.text()
                soup = BeautifulSoup(html_content, "html.parser")
                text = soup.get_text()
                return text


class BrowserArgs(BaseModel):
    url: str = Field(..., description="A valid url including protocol to analyze")


class Browser(BaseTool):
    args_schema = BrowserArgs

    async def arun(self, args: BrowserArgs) -> dict:
        url = args.url

        if not url.startswith(("http://", "https://")):
            url = "http://" + url

        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                html_content = await response.text()
                soup = BeautifulSoup(html_content, "html.parser")
                text = soup.get_text()
                return {"type": "function_call", "content": text}
