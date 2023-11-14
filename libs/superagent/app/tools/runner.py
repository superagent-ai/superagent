import json

from pydantic import ValidationError

from app.tools.tool import Tool


class ToolRunner:
    def __init__(self, json_input):
        self.json_input = json_input

    def parse_json(self):
        try:
            data = json.loads(self.json_input)
            return data
        except json.JSONDecodeError:
            return self.json_input

    def run(self) -> dict:
        data = self.parse_json()
        print(f"Invoking Tool: {data}")
        function_name = data.get("function", "")
        params = data.get("args", {})

        # Use the registry to get the correct tool class
        tool_class = Tool.get_tool_class(function_name)
        if tool_class is None:
            return {"type": "error", "content": "Error invoking Tool."}

        # Instantiate the tool and execute it.
        try:
            # Validate args with Pydantic.
            validated_args = tool_class.args_model(**params)
            tool_instance = tool_class()
            result = tool_instance.execute(validated_args)
            return result
        except ValidationError as e:
            return {"type": "error", "content": f"Validation Error: {str(e)}"}
        except Exception as e:
            return {
                "type": "error",
                "content": f"Error in executing the function: {str(e)}",
            }
