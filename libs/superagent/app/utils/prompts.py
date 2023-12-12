# flake8: noqa
from datetime import datetime
from typing import Dict, List


def get_current_date_str() -> str:
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def create_tool_prompt(tools: List[Dict]) -> str:
    tool_prompt = "Available functions:\n\n"
    for tool in tools:
        tool_prompt += f"{tool}\n"
    return tool_prompt


def create_function_calling_prompt(tools: List[Dict]) -> str:
    """
    Create a custom prompt for selecting the most suitable function and parameters.

    :param tools: A list of Tool class types.
    :return: A string representing the custom prompt.
    """
    fn = '{"name": "function_name", "parameters": {"arg_1": "value_1", "arg_2": "value_2", ...}}'
    tool_prompt = create_tool_prompt(tools)
    prompt = (
        f"You are a helpful assistant with access to the following functions:\n\n"
        f"{tool_prompt}\n"
        "To use these functions respond with:\n"
        f"<function_call> {fn} </function_call>\n\n"
        "Edge cases you must handle:\n"
        "- If there are no functions that match the user request, answer the user's question in a conversational manner.\n"
        "- If a function matches the user's request only respond with the <function_call> {fn} </function_call>, no other tokens allowed.\n\n"
        f"Current date: {get_current_date_str()}"
    )
    return prompt


def create_function_response_prompt(input: str, context: str) -> str:
    """
    Create a custom prompt for returning a Tool response.

    :param user_input: The user's request in natural language.
    :param context: The context provided by the Tool.
    :return: A string representing the custom prompt.
    """
    prompt = (
        "Answer the task/question by analyzing the context given.\n"
        "If the context is an answer to the task/question disregard the context and sources.\n"
        "Answer as a human having a conversation.\n\n"
        f"Current date: {get_current_date_str()}\n"
        f"Task/Question: {input}\n\n"
        f"Context:\n{context}\n\n"
    )
    return prompt
