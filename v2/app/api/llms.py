from fastapi import APIRouter, Depends
from app.utils.prisma import prisma
from app.utils.api import handle_exception, get_current_api_user
from app.utils.prisma import prisma
from app.utils.api import handle_exception
from app.models.response import LLM as LLMResponse, LLMList as LLMListResponse
from app.models.request import LLM as LLMRequest
from prisma import Json

router = APIRouter()


@router.post(
    "/llms",
    name="create",
    description="Create a new LLM",
    response_model=LLMResponse,
)
async def create(body: LLMRequest, api_user=Depends(get_current_api_user)):
    """Endpoint for creating an LLM"""
    print(f"{body}")
    try:
        data = await prisma.llm.create(
            {
                "apiUserId": api_user.id,
                "model": body.model,
                "provider": body.provider,
                "apiKey": body.apiKey,
                "options": Json(body.options),
            }
        )
        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)


@router.get(
    "/llms",
    name="list",
    description="List all LLMs",
    response_model=LLMListResponse,
)
async def list(api_user=Depends(get_current_api_user)):
    """Endpoint for listing all LLMs"""
    try:
        data = await prisma.llm.find_many(
            where={"apiUserId": api_user.id}, order={"createdAt": "desc"}
        )
        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)


@router.get(
    "/llms/{llm_id}",
    name="get",
    description="Get a single LLM",
    response_model=LLMResponse,
)
async def get(llm_id: str, api_user=Depends(get_current_api_user)):
    """Endpoint for getting a single LLM"""
    try:
        data = await prisma.llm.find_unique(
            where={"id": llm_id, "apiUserId": api_user.id}
        )
        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)


@router.patch(
    "/llms/{llm_id}",
    name="update",
    description="Patch an LLM",
    response_model=LLMResponse,
)
async def update(llm_id: str, body: LLMRequest, api_user=Depends(get_current_api_user)):
    """Endpoint for patching an LLM"""
    try:
        data = await prisma.llm.update(
            where={"id": llm_id},
            data={
                "apiUserId": api_user.id,
                "model": body.model,
                "provider": body.provider,
                "apiKey": body.apiKey,
                "options": Json(body.options),
            },
        )
        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)
