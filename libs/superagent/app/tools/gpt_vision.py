from langchain.tools import BaseTool
from openai import OpenAI, AsyncOpenAI


class GPTVision(BaseTool):
    name = "gpt vision"
    description = "useful for analyzing images"
    return_direct = False

    def _run(self, input: dict) -> str:
        client = OpenAI(api_key=self.metadata["openaiApiKey"])
        response = client.chat.completions.create(
            model="gpt-4-vision-preview",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": input["query"]},
                        {
                            "type": "image_url",
                            "image_url": input["image_url"],
                        },
                    ],
                }
            ],
            max_tokens=300,
        )
        output = response.choices[0]
        return output

    async def _arun(self, input: dict) -> str:
        client = AsyncOpenAI(api_key=self.metadata["openaiApiKey"])
        response = await client.chat.completions.create(
            model="gpt-4-vision-preview",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": input["query"]},
                        {
                            "type": "image_url",
                            "image_url": input["image_url"],
                        },
                    ],
                }
            ],
            max_tokens=300,
        )
        output = response.choices[0]
        return output
