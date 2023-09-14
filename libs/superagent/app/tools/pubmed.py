from typing import Optional
from langchain.tools import BaseTool, PubmedQueryRun
from langchain.callbacks.manager import (
    AsyncCallbackManagerForToolRun,
    CallbackManagerForToolRun,
)


class PubMed(BaseTool):
    name = "PubMed® search"
    description = "useful for answering question about medical publications"
    return_direct = False

    def _run(
        self,
        search_query: str,
        _run_manager: Optional[CallbackManagerForToolRun] = None,
    ) -> str:
        pubmed = PubmedQueryRun(args_schema=self.args_schema)
        output = pubmed.run(search_query)
        return output

    async def _arun(
        self,
        search_query: str,
        _run_manager: Optional[AsyncCallbackManagerForToolRun] = None,
    ) -> str:
        pubmed = PubmedQueryRun(args_schema=self.args_schema)
        output = pubmed.run(search_query)
        return output
