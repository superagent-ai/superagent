from prisma.enums import AgentType


def get_first_key(dictionary) -> str | None:
    return next(iter(dictionary)) if dictionary else None


def check_is_agent_tool(tool_type):
    for agent_type in AgentType:
        if tool_type == agent_type.value:
            return True
