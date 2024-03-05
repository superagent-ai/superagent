from langchain.agents import AgentType, initialize_agent
from langchain_community.agent_toolkits import ZapierToolkit
from langchain_community.tools import BaseTool
from langchain_community.utilities.zapier import ZapierNLAWrapper
from langchain_openai import ChatOpenAI


class ZapierNLA(BaseTool):
    name = "Zapier"
    description = (
        "useful for performing actions such sending emails, scheduling meetings etc."
    )
    return_direct = False

    def _run(self, input: str) -> str:
        zapier_nla_api_key = self.metadata["zapierNlaApiKey"]
        zapier = ZapierNLAWrapper(zapier_nla_api_key=zapier_nla_api_key)
        toolkit = ZapierToolkit.from_zapier_nla_wrapper(zapier)
        agent = initialize_agent(
            toolkit.get_tools(),
            llm=ChatOpenAI(openai_api_key=self.metadata["openaiApiKey"], model="gpt-4"),
            agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
            verbose=True,
        )
        output = agent.run(input)
        return output

    async def _arun(self, input: str) -> str:
        zapier_nla_api_key = self.metadata["zapierNlaApiKey"]
        zapier = ZapierNLAWrapper(zapier_nla_api_key=zapier_nla_api_key)
        toolkit = ZapierToolkit.from_zapier_nla_wrapper(zapier)
        agent = initialize_agent(
            toolkit.get_tools(),
            llm=ChatOpenAI(openai_api_key=self.metadata["openaiApiKey"], model="gpt-4"),
            agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
            verbose=True,
        )
        output = await agent.arun(input)
        return output
