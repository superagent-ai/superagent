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


openapi_format_instructions = """Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: what to instruct the AI Action representative.
Observation: The Agent's response
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer. User can't see any of my observations, API responses, links, or tools.
Final Answer: the final answer to the original input question

When responding with your Final Answer, make the response short but conversational."""

default_chat_template = """Assistant is designed to be able to assist with a wide range of tasks, from answering 
simple questions to providing in-depth explanations and discussions on a wide range of 
topics.


{chat_history}
Human: {human_input}
Assitant:
"""

agent_template = """Answer the following questions as best you can. You have access to the following tools:

{tools}

Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

Begin!

Previous conversation history:
{chat_history}

New question: {human_input}
{agent_scratchpad}"""

default_chat_prompt = PromptTemplate(
    input_variables=["chat_history", "human_input"],
    template=default_chat_template,
)
