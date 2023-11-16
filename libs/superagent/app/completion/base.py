from typing import List

from litellm import acompletion
from prisma.models import AgentLLM

from app.tools.prompts import (
    create_function_calling_prompt,
    create_function_response_prompt,
)
from app.tools.chitchat import ChitChatTool
from app.tools.runner import ToolRunner
from app.completion.types import MODEL_MAPPER


class Completion:
    def __init__(
        self, prompt: str, llm: AgentLLM, model: str, memory: str, tools: List[str]
    ):
        self.prompt = prompt
        self.llm = llm
        self.memory = memory
        self.tools = tools
        self.model = model

    async def _run_completion(
        self,
        prompt: str,
        temperature: int = 0.5,
        max_tokens: int = 1024,
    ):
        model_name = MODEL_MAPPER[self.llm.llm.provider][self.model]
        messages = [{"content": prompt, "role": "user"}]
        response = await acompletion(
            temperature=temperature,
            max_tokens=max_tokens,
            model=model_name,
            messages=messages,
        )
        print(f"Invoking LLM: {response['usage']['total_tokens']} tokens used")
        return response

    async def acall(self, *args, **kwargs):
        input = kwargs["inputs"]["input"]
        prompt = create_function_calling_prompt(input=input, tools=[ChitChatTool])
        response = await self._run_completion(prompt)
        runner = ToolRunner(response["choices"][0]["message"]["content"])
        prediction = await runner.run()

        if prediction["type"] == "function_call":
            prompt = create_function_response_prompt(
                input=input, context=prediction["content"]
            )
            print(prompt)
            response = await self._run_completion(prompt)
            return response["choices"][0]["message"]["content"]
        else:
            return prediction["content"]
