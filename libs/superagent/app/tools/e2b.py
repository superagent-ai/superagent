from decouple import config
from e2b import run_code, run_code_sync
from langchain.tools import BaseTool


class E2BCodeExecutor(BaseTool):
    name = "Code interpreter"
    description = "useful for running python code, it returns the output of the code"

    def _run(self, python_code: str) -> str:
        api_token = config("E2B_API_KEY")
        output, err = run_code_sync("Python3_DataAnalysis", python_code, api_token)

        if err:
            return "There was following error during execution: " + err

        return output

    async def _arun(self, python_code: str) -> str:
        api_token = config("E2B_API_KEY")
        output, err = await run_code("Python3_DataAnalysis", python_code, api_token)

        if err:
            return "There was following error during execution: " + err

        print("output", output)
        return output
