from prisma.enums import AgentType


def check_is_agent_tool(tool_type):
    for agent_type in AgentType:
        if tool_type == agent_type.value:
            return True
