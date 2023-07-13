export const getPromptVariables = (string) => {
  let variables = [];
  let regex = /{(.*?)}/g;
  let match;

  while ((match = regex.exec(string))) {
    variables.push(match[1].trim());
  }

  return variables;
};

export const DEFAULT_PROMPT = `Assistant is designed to be able to assist with a wide range of tasks, from answering 
simple questions to providing in-depth explanations and discussions on a wide range of 
topics.


{chat_history}
Human: {input}
Assistant:
`;

export const REACT_AGENT_PROMPT = `Answer the following questions as best you can. You have access to the following tools:

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

Always include "Final Answer:" when answering.

Begin!

Previous conversation history:
{chat_history}

New question: {input}
{agent_scratchpad}`;

export const OPENAI_AGENT_PROMPT = `Assistant is designed to be able to assist with a wide range of tasks, from answering simple questions to providing in-depth explanations and discussions on a wide range of topics.`;
