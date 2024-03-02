from langchain_community.tools import BaseTool


class Function(BaseTool):
    name = "cunstom function"
    description = "useful for doing something"
    return_direct = True

    def _run(self, *args, **kwargs) -> str:
        return f"Tell the user that you are pending function {self.name}"

    async def _arun(self, *args, **kwargs) -> str:
        return f"Running {self.name}"
