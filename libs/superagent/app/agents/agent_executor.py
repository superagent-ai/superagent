import json
from typing import Any, List

import litellm
from langchain.tools import format_tool_to_openai_function

class AgentExecutor():
    def __init__(self, tools, llmModel: str, prompt: str, memory: Any, enable_streaming: bool = False):
        self.tools = tools
        self.llmModel = llmModel
        self.prompt = prompt
        self.memory = memory
        self.enable_streaming = enable_streaming

    async def _get_functions(self, tools) -> List:
        functions = []
        # get the functions from tools object
        for name, tool in tools.items():
            functions.append(
                {
                    "type": "function",
                    "function": {
                        **format_tool_to_openai_function(tool),
                        "name": name,
                    },
                }
            )

        return functions


    async def acall(self, input: str):
        functions = await self._get_functions(self.tools)


        messages = [
            {"role": "system", "content": self.prompt},
            {
                "role": "user",
                "content": input,
            },
        ]

        response = litellm.completion(
            model="gpt-3.5-turbo",
            messages=messages,
            tools=functions if len(functions) > 0 else None,
            stream=self.enable_streaming,
        )
        if self.enable_streaming:            
            chunks = []
            for chunk in response: 
                chunks.append(chunk)

            response = litellm.stream_chunk_builder(chunks, messages=messages)

        response_message = response.choices[0].message

        # check if the model wanted to call a function
        if hasattr(response_message, 'tool_calls'):
            tool_calls = response_message.tool_calls
            messages.append(
                response_message
            )  # extend conversation with assistant's reply

            for tool_call in tool_calls:
                function_name = tool_call.function.name
                function_args = json.loads(tool_call.function.arguments)
                function_to_call = self.tools[function_name]
                function_response = await function_to_call._arun(**function_args)

                messages.append(
                    {
                        "tool_call_id": tool_call.id,
                        "role": "tool",
                        "name": function_name,
                        "content": str(function_response),
                    }
                )  # extend conversation with function response

            response =  litellm.completion(
                model="gpt-3.5-turbo-1106",
                messages=messages,
                stream=self.enable_streaming,
            )  # get a new response from the model where it can see the function response
        
            if self.enable_streaming:
                chunks = []
                for chunk in response: 
                    chunks.append(chunk)

            
        if self.enable_streaming:
            return chunks
        return response


