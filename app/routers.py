from fastapi import APIRouter

from app.api import agents, api_tokens, auth, documents, users

router = APIRouter()
api_prefix = "/api/v1"

router.include_router(agents.router, tags=["Agent"], prefix=api_prefix)
router.include_router(auth.router, tags=["Auth"], prefix=api_prefix)
router.include_router(users.router, tags=["User"], prefix=api_prefix)
router.include_router(api_tokens.router, tags=["Api token"], prefix=api_prefix)
router.include_router(documents.router, tags=["Documents"], prefix=api_prefix)
