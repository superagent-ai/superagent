from langchain_community.tools import BaseTool
from openai import AsyncOpenAI, OpenAI


class GPTVision(BaseTool):
    name = "gpt vision"
    description = "useful for analyzing images"
    return_direct = False

    def _run(self, input: dict) -> str:
        client = OpenAI(api_key=self.metadata["openaiApiKey"])
        try:
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
        except Exception as e:
            output = str(e)
        return output

    async def _arun(self, input: dict) -> str:
        client = AsyncOpenAI(api_key=self.metadata["openaiApiKey"])
        try:
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
        except Exception as e:
            output = str(e)
        return output
