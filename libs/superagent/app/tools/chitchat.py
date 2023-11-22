from typing import Type, Tuple, List, Any

from litellm import completion
from pydantic import BaseModel, Field

from app.tools.tool import Tool
from app.tools.prompts import create_memory_prompt


class ChitChatArgs(BaseModel):
    message: str = Field(..., description="The users input message")


class ChitChatTool(Tool):
    name = "chitchat"
    description = "Useful when no other function is relevant to the user input."
    args_model: Type[BaseModel] = ChitChatArgs

    def __init__(self, memory: Tuple[str, List[Any]]):
        self.memory = memory

    def execute(self, args: ChitChatArgs):
        prompt = create_memory_prompt(input=args.message, memory=self.memory)
        print(prompt)
        messages = [{"content": prompt, "role": "user"}]
        response = completion(
            temperature=0.5,
            max_tokens=1024,
            model="replicate/mistral-7b-instruct-v0.1:83b6a56e7c828e667f21fd596c338fd4f0039b46bcfa18d973e8e70e455fda70",
            messages=messages,
        )
        return {
            "type": "assistant",
            "content": response["choices"][0]["message"]["content"],
        }
