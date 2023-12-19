from abc import ABC, abstractmethod
from typing import Any, Dict, Optional

from pydantic import BaseModel


class BaseTool(ABC):
    args_schema: BaseModel = None

    def __init__(
        self,
        name: str,
        description: str,
        metadata: Optional[Dict[str, Any]] = None,
    ):
        self.name = name
        self.description = description
        self.metadata = metadata

        if self.args_schema is None:
            raise NotImplementedError("args_schema must be defined in the subclass.")

    def get_function_metadata(self) -> dict:
        schema = self.args_schema.schema()
        properties = schema.get("properties", {})
        required = schema.get("required", [])

        for prop in properties.values():
            prop.pop("title", None)

        function_metadata = {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": {
                    "type": "object",
                    "properties": properties,
                    "required": required,
                },
            },
        }
        return function_metadata

    async def run(self, **kwargs):
        # Validate the input arguments against the args_schema
        if self.args_schema:
            validated_args = self.args_schema(**kwargs)
        else:
            raise NotImplementedError("args_schema must be defined in the subclass.")

        # Call the abstract method with validated arguments
        return await self.arun(validated_args)

    @abstractmethod
    async def arun(self, validated_args: BaseModel):
        pass
