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

default_chat_prompt = PromptTemplate(
    input_variables=["chat_history", "human_input"], template=default_chat_template
)
