# flake8: noqa
from langchain.prompts.prompt import PromptTemplate

default_chat_template = """Assistant is a large language model trained by OpenAI.

Assistant is designed to be able to assist with a wide range of tasks, from answering 
simple questions to providing in-depth explanations and discussions on a wide range of 
topics.


{chat_history}
Human: {human_input}
Assitant:
"""

openapi_format_instructions = """Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: what to instruct the AI Action representative.
Observation: The Agent's response
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer. User can't see any of my observations, API responses, links, or tools.
Final Answer: the final answer to the original input question in markdown.

When responding with your Final Answer, use a conversational answer without referencing the API.
"""

default_chat_prompt = PromptTemplate(
    input_variables=["chat_history", "human_input"], template=default_chat_template
)
