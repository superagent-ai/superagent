from typing import List, Type, Tuple, Any

from app.tools.tool import Tool


def create_function_calling_prompt(input: str, tools: List[Type[Tool]]) -> str:
    """
    Create a custom prompt for selecting the most suitable function and parameters.

    :param input: The user's request in natural language.
    :param tool_classes: A list of Tool class types.
    :return: A string representing the custom prompt.
    """

    prompt = (
        "Your are a helpful AI Assistant. Answer the user in a conversational manner. "
        "Occasionally you will have to use a function to answer the users question "
        "from the list of available functions below in which case you should "
        "provide your response in JSON format.\n\n"
        "Do not come up with your own functions.\n\n"
        f"User: {input}\n\n"
    )
    prompt += "Available functions:\n\n"
    for tool_cls in tools:
        tool_name = tool_cls.name
        tool_description = tool_cls.description
        tool_params = tool_cls.args_model.schema()["properties"]
        prompt += f"{tool_name}:\n"
        prompt += f"  description: {tool_description}\n"
        prompt += "  args:\n"
        for param_name, param_details in tool_params.items():
            description = param_details.get("description", "No description provided")
            prompt += f"    {param_name}: {description}\n"
    return prompt


def create_function_response_prompt(
    input: str, context: str, memory: Tuple[str, List[Any]]
) -> str:
    """
    Create a custom prompt for returning a Tool response.

    :param input: The user's request in natural language.
    :param context: The context provided by the Tool.
    :return: A string representing the custom prompt.
    """

    prompt = (
        "You are an helpful AI Assistant, answer the question by "
        "providing the most suitable response based on the context provided.\n\n"
        f"Input: {input}\n\n"
        f"Context:\n{context}\n\n"
        f"Chat history:\n{memory[1]}"
    )
    return prompt


def create_memory_prompt(input: str, memory: Tuple[str, List[Any]]) -> str:
    """
    Create a custom prompt for memory.

    :param input: The user's request in natural language.
    :param memory: The memory tuple with context and history.
    :system_prompt: A string representing the system prompt.
    """
    prompt = (
        "You are an helpful AI Assistant. Answer the user in a converstaional manner.\n\n"
        f"Human: {input}\n\n"
        f"Chat history:\n{memory[1]}"
    )
    return prompt
