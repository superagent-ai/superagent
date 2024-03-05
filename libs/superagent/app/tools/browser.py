import logging

import aiohttp
import requests
from bs4 import BeautifulSoup, Comment, NavigableString, Tag
from langchain_community.tools import BaseTool as LCBaseTool
from pydantic import BaseModel, Field

from app.tools.base import BaseTool

logger = logging.getLogger(__name__)


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

        def extract_text_with_links(element):
            texts = []
            for child in element.children:
                if isinstance(child, Comment):
                    continue
                elif isinstance(child, NavigableString):
                    stripped_text = str(child).strip()
                    if stripped_text.startswith("xml") and stripped_text.endswith('"?'):
                        continue
                    if stripped_text:
                        texts.append(stripped_text)
                elif isinstance(child, Tag):
                    if child.name == "a":
                        link_text = child.get_text(strip=True)
                        href = child.get("href", "").strip()
                        if href and href != "/":
                            texts.append(
                                f"{link_text} {href}" if link_text else f"{href}"
                            )
                    elif child.name == "iframe":
                        src = child.get("src", "").strip()
                        if src:
                            texts.append(src)
                    elif child.name not in ["script", "style", "noscript", "xml"]:
                        texts.append(extract_text_with_links(child))

            return "\n".join(filter(None, texts))

        cleaned_text = extract_text_with_links(soup)
        logger.debug(f"BROWSER TOOL result: {cleaned_text}")
        return cleaned_text


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
