from fastapi import APIRouter

from app.api import agents, llms

router = APIRouter()
api_prefix = "/api/v1"

router.include_router(agents.router, tags=["Agent"], prefix=api_prefix)
router.include_router(llms.router, tags=["LLM"], prefix=api_prefix)
