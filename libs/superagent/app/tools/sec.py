import aiohttp
from langchain_community.tools import BaseTool


class SEC(BaseTool):
    name = "SEC"
    description = "useful for searching SEC filings for a company"
    return_direct = False

    def _run(self, ticker: str) -> str:
        pass

    async def _arun(self, ticker: str) -> str:
        form = self.metadata.get("form")
        identity = self.metadata.get("identity")
        url = "https://super-sec.replit.app/search"
        data = {"form": form, "identity": identity, "ticker": ticker}

        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=data) as response:
                return await response.text()
