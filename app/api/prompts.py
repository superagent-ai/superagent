import json
import logging

from fastapi import APIRouter, Depends, HTTPException, status

from app.lib.auth.prisma import JWTBearer
from app.lib.models.prompt import Prompt
from app.lib.prisma import prisma

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/prompts", name="Create a prompt", description="Create a new prompt")
async def create_prompt(body: Prompt, token=Depends(JWTBearer())):
    """Create prompt endpoint"""

    try:
        prompt = prisma.prompt.create(
            {
                "name": body.name,
                "input_variables": json.dumps(body.input_variables),
                "template": body.template,
                "userId": token["userId"],
            },
            include={"user": True},
        )
        return {"success": True, "data": prompt}
    except Exception as e:
        logger.error(e)
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )


@router.get("/prompts", name="List prompts", description="List all prompts")
async def read_prompts(token=Depends(JWTBearer())):
    """List prompts endpoint"""
    try:
        prompts = prisma.prompt.find_many(
            where={"userId": token["userId"]},
            include={"user": True},
            order={"createdAt": "desc"},
        )
        return {"success": True, "data": prompts}
    except Exception as e:
        logger.error("Couldn't find prompts for user", exc_info=e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@router.get(
    "/prompts/{promptId}",
    name="Get prompt",
    description="Get a specific prompt",
)
async def read_prompt(promptId: str, token=Depends(JWTBearer())):
    """Get prompt endpoint"""
    try:
        prompt = prisma.prompt.find_unique(
            where={"id": promptId}, include={"user": True}
        )
        return {"success": True, "data": prompt}
    except Exception as e:
        logger.error("Couldn't find prompt", exc_info=e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@router.delete(
    "/prompts/{promptId}",
    name="Delete prompt",
    description="Delete a specific prompt",
)
async def delete_prompt(promptId: str, token=Depends(JWTBearer())):
    """Delete prompt endpoint"""
    try:
        prisma.prompt.delete(where={"id": promptId})
        return {"success": True, "data": None}
    except Exception as e:
        logger.error("Couldn't delete prompt with id {promptId}", exc_info=e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@router.patch(
    "/prompts/{promptId}", name="Patch prompt", description="Patch a specific prompt"
)
async def patch_prompt(promptId: str, body: dict, token=Depends(JWTBearer())):
    """Patch prompt endpoint"""
    try:
        input_variables = body["input_variables"]
        if input_variables or input_variables == []:
            body["input_variables"] = json.dumps(input_variables)
        prompt = prisma.prompt.update(
            data=body,
            where={"id": promptId},
        )
        return {"success": True, "data": prompt}
    except Exception as e:
        logger.error("Couldn't patch prompt with id {promptId}", exc_info=e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
