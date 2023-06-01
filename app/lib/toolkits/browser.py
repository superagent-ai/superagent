from typing import List
from langchain.agents.agent_toolkits import PlayWrightBrowserToolkit
from langchain.tools.playwright.utils import (
    create_sync_playwright_browser,
)


def get_tools() -> List:
    browser = create_sync_playwright_browser()
    browser_toolkit = PlayWrightBrowserToolkit.from_browser(sync_browser=browser)
    tools = browser_toolkit.get_tools()

    return tools
