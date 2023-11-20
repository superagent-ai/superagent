import litellm

from typing import List, Tuple, Any

from litellm import acompletion
from prisma.models import AgentLLM, Agent

from app.tools.prompts import (
    create_function_calling_prompt,
    create_function_response_prompt,
)
from app.tools.chitchat import ChitChatTool
from app.tools.runner import ToolRunner
from app.completion.types import MODEL_MAPPER
from app.memory.base import Memory

litellm.huggingface_key = "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"


class Completion:
    def __init__(
        self,
        agent: Agent,
        llm: AgentLLM,
        model: str,
        memory: Memory,
        tools: List[str],
    ):
        self.agent = agent
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
        chat_memory = await self.memory.init()
        prompt = create_function_calling_prompt(input=input, tools=[])
        response = await self._run_completion(prompt)
        runner = ToolRunner(response["choices"][0]["message"]["content"], chat_memory)
        prediction = await runner.run()

        if prediction["type"] == "function_call":
            prompt = create_function_response_prompt(
                input=input, context=prediction["content"]
            )
            response = await self._run_completion(prompt)
            output = response["choices"][0]["message"]["content"]
            self.memory.save_context(input=input, output=output)
            return output
        else:
            output = prediction["content"]
            self.memory.save_context(input=input, output=output)
            return output
