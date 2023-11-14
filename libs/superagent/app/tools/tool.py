from typing import Dict, Type

from pydantic import BaseModel


class Tool:
    name: str = "Generic Tool"
    description: str = "A generic tool description."
    args_model: Type[BaseModel] = BaseModel
    registry: Dict[str, Type["Tool"]] = {}

    @classmethod
    def get_info(cls):
        info_lines = [f"{cls.name}:", f"  description: {cls.description}", "  args:"]
        if issubclass(cls.args_model, BaseModel):
            for field_name, model_field in cls.args_model.__fields__.items():
                description = model_field.description or "No description provided"
                info_lines.append(f"     {field_name}: {description}")
        return "\n".join(info_lines)

    @classmethod
    def register_tool(cls, name: str, tool_cls: Type["Tool"]):
        cls.registry[name] = tool_cls

    @classmethod
    def get_tool_class(cls, name: str) -> Type["Tool"]:
        if name not in cls.registry:
            raise ValueError(f"Tool class for '{name}' not found.")
        return cls.registry[name]

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        Tool.register_tool(cls.name, cls)

    def execute(self, args: BaseModel):
        raise NotImplementedError("Subclasses should implement this method.")
