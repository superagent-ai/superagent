from typing import Type

from litellm import completion
from pydantic import BaseModel, Field

from app.tools.tool import Tool


class ChitChatArgs(BaseModel):
    message: str = Field(..., description="The message to reply to")


class ChitChatTool(Tool):
    name = "chitchat"
    description = "Useful when no other function is relevant to the user input."
    args_model: Type[BaseModel] = ChitChatArgs

    def execute(self, args: ChitChatArgs):
        messages = [{"content": args.message, "role": "user"}]
        response = completion(
            temperature=0.5,
            max_tokens=1024,
            model="huggingface/mistralai/Mistral-7B-Instruct-v0.1",
            messages=messages,
        )
        return {
            "type": "assistant",
            "content": response["choices"][0]["message"]["content"],
        }
