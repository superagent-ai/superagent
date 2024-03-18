from langchain_community.tools import BaseTool


class Github(BaseTool):
    name = "Github"
    description = "useful for answering questions about github projects"
    return_direct = False

    def _run(self, query: str) -> str:
        pass

    async def _arun(self, query: str) -> str:
        pass
