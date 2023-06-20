# flake8: noqa
from typing import List
from langchain.prompts.prompt import PromptTemplate
from langchain.prompts import StringPromptTemplate
from langchain.agents import Tool


class CustomPromptTemplate(StringPromptTemplate):
    template: str
    tools: List[Tool]

    def format(self, **kwargs) -> str:
        intermediate_steps = kwargs.pop("intermediate_steps")
        thoughts = ""

        for action, observation in intermediate_steps:
            thoughts += action.log
            thoughts += f"\nObservation: {observation}\nThought: "
        kwargs["agent_scratchpad"] = thoughts
        kwargs["tools"] = "\n".join(
            [f"{tool.name}: {tool.description}" for tool in self.tools]
        )
        kwargs["tool_names"] = ", ".join([tool.name for tool in self.tools])

        return self.template.format(**kwargs)


default_chat_template = """Assistant is designed to be able to assist with a wide range of tasks, from answering 
simple questions to providing in-depth explanations and discussions on a wide range of 
topics.


{chat_history}
Human: {input}
Assitant:
"""

DEFAULT_CHAT_PROMPT = PromptTemplate(
    input_variables=["chat_history", "input"],
    template=default_chat_template,
)
