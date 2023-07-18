from fastapi import APIRouter

from app.api import (
    agent_documents,
    agent_tools,
    agents,
    api_tokens,
    auth,
    documents,
    prompts,
    tags,
    tools,
    traces,
    users,
)

router = APIRouter()
api_prefix = "/api/v1"

router.include_router(agents.router, tags=["Agent"], prefix=api_prefix)
router.include_router(
    agent_documents.router, tags=["Agent documents"], prefix=api_prefix
)
router.include_router(tags.router, tags=["Tags"], prefix=api_prefix)
router.include_router(agent_tools.router, tags=["Agent tools"], prefix=api_prefix)
router.include_router(auth.router, tags=["Auth"], prefix=api_prefix)
router.include_router(users.router, tags=["User"], prefix=api_prefix)
router.include_router(api_tokens.router, tags=["Api token"], prefix=api_prefix)
router.include_router(documents.router, tags=["Documents"], prefix=api_prefix)
router.include_router(prompts.router, tags=["Prompts"], prefix=api_prefix)
router.include_router(tools.router, tags=["Tools"], prefix=api_prefix)
router.include_router(traces.router, tags=["Traces"], prefix=api_prefix)
