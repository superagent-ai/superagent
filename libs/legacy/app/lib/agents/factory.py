from app.lib.agents.agent import DefaultAgent, OpenAIAgent, ReactAgent
from app.lib.agents.base import AgentBase


class AgentFactory:
    @staticmethod
    def create_agent(agent_base: AgentBase):
        if agent_base.type == "OPENAI":
            if agent_base.tools or agent_base.documents:
                return OpenAIAgent(agent_base)

            return DefaultAgent(agent_base)

        elif agent_base.type == "REACT":
            if agent_base.tools or agent_base.documents:
                return ReactAgent(agent_base)

            return DefaultAgent(agent_base)

        else:
            return DefaultAgent(agent_base)
