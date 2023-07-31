import logging

from fastapi import APIRouter, Depends, HTTPException, status

from app.lib.auth.prisma import JWTBearer
from app.lib.models.tag import Tag
from app.lib.prisma import prisma

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/tags", name="Create a tag", description="Create a new tag")
async def create_tag(body: Tag, token=Depends(JWTBearer())):
    """Create tag endpoint"""
    try:
        tag = prisma.tag.create(
            {
                "name": body.name,
                "color": body.color,
                "userId": token["userId"],
            },
        )
        return {"success": True, "data": tag}
    except Exception as e:
        logger.error("Couldn't create tag", exc_info=e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@router.get("/tags", name="List tags", description="List all tags")
async def read_tags(token=Depends(JWTBearer())):
    """List tags endpoint"""
    try:
        tags = prisma.tag.find_many(
            where={"userId": token["userId"]},
            order={"createdAt": "desc"},
        )
        return {"success": True, "data": tags}
    except Exception as e:
        logger.error("Couldn't find tags for user", exc_info=e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@router.get(
    "/tags/{tagId}",
    name="Get tag",
    description="Get a specific tag",
)
async def read_tag(tagId: str, token=Depends(JWTBearer())):
    """Get tag endpoint"""
    try:
        tag = prisma.tag.find_unique(where={"id": tagId})
        return {"success": True, "data": tag}
    except Exception as e:
        logger.error("Couldn't find tag", exc_info=e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@router.delete(
    "/tags/{tagId}",
    name="Delete tag",
    description="Delete a specific tag",
)
async def delete_tag(tagId: str, token=Depends(JWTBearer())):
    """Delete tag endpoint"""
    try:
        prisma.tag.delete(where={"id": tagId})
        return {"success": True, "data": None}
    except Exception as e:
        logger.error("Couldn't delete tag with id {tagId}", exc_info=e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@router.patch("/tags/{tagId}", name="Patch tag", description="Patch a specific tag")
async def patch_tag(tagId: str, body: dict, token=Depends(JWTBearer())):
    """Patch tag endpoint"""
    try:
        tag = prisma.tag.update(
            data=body,
            where={"id": tagId},
        )
        return {"success": True, "data": tag}
    except Exception as e:
        logger.error(f"Couldn't patch tag with id {tagId}", exc_info=e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
