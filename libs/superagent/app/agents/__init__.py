import json
import litellm
import logging
import re
from typing import Optional, List, Dict, Any, Tuple, Coroutine, Callable

from litellm import acompletion
from app.tools import ToolRunner
from app.tools.prompt import (
    create_function_calling_prompt,
    create_function_response_prompt,
)

logging.basicConfig(level=logging.INFO)


class Superagent:
    def __init__(
        self,
        api_key: str,
        model: str,
        api_base: str = None,
        tools: List[Callable] = [],
        memory: Tuple[str, List[Any]] = None,
        temperature: float = 0.5,
        max_tokens: int = 2000,
        callback: Optional[Callable[[str], Coroutine]] = None,
    ) -> None:
        self.api_key = api_key
        self.api_base = api_base
        self.model = model
        self.temperature = temperature
        self.max_tokens = max_tokens
        self.callback = callback
        self.tools = tools
        self.memory = memory

    def extract_content(self, chunk: Dict[str, Any]) -> str:
        return chunk.get("choices", [{}])[0].get("delta", {}).get("content", "")

    def extract_function_calls(self, completion: str) -> Optional[str]:
        pattern = r"(<function_call>(.*?)</function_call>)"
        match = re.search(pattern, completion.strip(), re.DOTALL)
        if not match:
            return None
        function_call = json.loads(match.group(2).strip())
        if function_call.get("name") in self.get_tool_names():
            return function_call
        return None

    def get_tool_names(self) -> List[str]:
        return [tool.__name__ for tool in self.tools]

    async def run_completion(
        self, system_prompt: Optional[str], prompt: str, stream: bool = False
    ) -> str:
        messages = self.create_messages(system_prompt, prompt)

        if stream:
            return await self.stream_completion(
                messages,
            )
        else:
            return await self.single_completion(messages)

    async def stream_completion(self, messages: List[Dict[str, str]]) -> str:
        response_content = ""
        async for chunk in await acompletion(
            temperature=self.temperature,
            max_tokens=self.max_tokens,
            model=self.model,
            messages=messages,
            stream=True,
            api_base=self.api_base,
            api_key=self.api_key,
        ):
            content = self.extract_content(chunk)
            response_content += content
            if self.callback:
                await self.callback(content)
        return response_content

    async def single_completion(self, messages: List[Dict[str, str]]) -> str:
        content = await acompletion(
            temperature=self.temperature,
            max_tokens=self.max_tokens,
            model=self.model,
            messages=messages,
            stream=False,
            api_base=self.api_base,
            api_key=self.api_key,
        )
        return content.choices[0].message.content

    def create_messages(
        self, system_prompt: Optional[str], prompt: str
    ) -> List[Dict[str, str]]:
        messages = (
            [{"role": "system", "content": system_prompt}] if system_prompt else []
        )
        messages.append({"content": prompt, "role": "user"})
        return messages

    async def create_and_run_prompt(self, input: str, stream: bool = False) -> str:
        prompt = create_function_calling_prompt(
            tools=[litellm.utils.function_to_dict(tool) for tool in self.tools]
        )
        return await self.run_completion(
            system_prompt=prompt, prompt=input, stream=stream
        )

    async def process_response(self, response: str, input: str) -> str:
        match = self.extract_function_calls(response)
        prediction = {"content": response}
        if match:
            runner = ToolRunner(match)
            prediction = await runner.run()
        prompt = create_function_response_prompt(
            input=input, context=prediction["content"]
        )
        return await self.run_completion(
            prompt=prompt, system_prompt=None, stream=False
        )

    async def acall(self, inputs: dict, *args, **kwargs) -> str:
        input = inputs["input"]
        response = await self.create_and_run_prompt(input)
        return await self.process_response(response, input)
