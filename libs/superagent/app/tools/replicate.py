from langchain.llms.replicate import Replicate as ReplicateModel
from langchain_community.tools import BaseTool


class Replicate(BaseTool):
    name = "Replicate"
    description = "useful for querying a Replicate model."
    return_direct = False

    def _run(self, prompt: str) -> str:
        model = self.metadata["model"]
        api_token = self.metadata["apiKey"]
        input = self.metadata["arguments"]
        model = ReplicateModel(
            model=model, input=input, api_token=api_token, replicate_api_token=api_token
        )
        output = model.predict(prompt)
        return output

    async def _arun(self, prompt: str) -> str:
        model = self.metadata["model"]
        api_token = self.metadata["apiKey"]
        model = ReplicateModel(model=model, replicate_api_token=api_token)
        output = await model.apredict(prompt)
        return output
