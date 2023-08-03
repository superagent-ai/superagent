import hashlib
import json
import logging

from fastapi import APIRouter, Depends, HTTPException, status

from app.lib.auth.prisma import JWTBearer
from app.lib.documents import upsert_document, valid_ingestion_types
from app.lib.models.document import Document
from app.lib.prisma import prisma

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/documents", name="Create document", description="Create a new document")
async def create_document(body: Document, token=Depends(JWTBearer())):
    """Create document endpoint"""
    try:
        if body.content is not None:
            content_hash = hashlib.sha256(body.content.encode()).hexdigest()
        else:
            content_hash = None

        document = prisma.document.create(
            {
                "type": body.type,
                "url": body.url,
                "content": body.content,
                "contentHash": content_hash,
                "userId": token["userId"],
                "name": body.name,
                "splitter": json.dumps(body.splitter),
                "authorization": json.dumps(body.authorization),
                "metadata": json.dumps(body.metadata),
            }
        )

        if body.type in valid_ingestion_types:
            upsert_document(
                url=body.url,
                content=body.content,
                type=body.type,
                document_id=document.id,
                authorization=body.authorization,
                metadata=body.metadata,
                text_splitter=body.splitter,
                from_page=body.from_page,
                to_page=body.to_page,
                user_id=token["userId"],
            )
        else:
            logger.error("Invalid ingestion type")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Invalid ingestion type",
            )
        return {"success": True, "data": document}
    except Exception as e:
        logger.error("Couldn't create document", exc_info=e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


@router.get("/documents", name="List documents", description="List all documents")
async def read_documents(token=Depends(JWTBearer())):
    """List documents endpoint"""
    try:
        documents = prisma.document.find_many(
            where={"userId": token["userId"]},
            include={"user": True},
            order={"createdAt": "desc"},
        )

        if documents or documents == []:
            return {"success": True, "data": documents}
    except Exception as e:
        logger.error("Couldn't find documents", exc_info=e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No agents found",
        )


@router.get(
    "/documents/{documentId}",
    name="Get document",
    description="Get a specific document",
)
async def read_document(documentId: str, token=Depends(JWTBearer())):
    """Get a single document"""
    try:
        document = prisma.document.find_unique(
            where={"id": documentId}, include={"user": True}
        )
    except Exception as e:
        logger.error("Couldn't find document with id {documentId}", exc_info=e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Agent with id: {documentId} not found",
        )

    if document:
        return {"success": True, "data": document}
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail=f"Agent with id: {documentId} not found",
    )


@router.delete(
    "/documents/{documentId}",
    name="Delete document",
    description="Delete a specific document",
)
async def delete_document(documentId: str, token=Depends(JWTBearer())):
    """Delete a document"""
    try:
        prisma.document.delete(where={"id": documentId})
        return {"success": True, "data": None}
    except Exception as e:
        logger.error("Couldn't delete document with id {documentId}", exc_info=e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@router.patch(
    "/documents/{documentId}",
    name="Patch document",
    description="Patch a specific document",
)
async def patch_document(documentId: str, body: dict, token=Depends(JWTBearer())):
    """Patch document endpoint"""
    try:
        metadata = body.get("metadata")

        if metadata or metadata == {} or metadata == []:
            body["metadata"] = json.dumps(metadata)

        document = prisma.document.update(
            data=body,
            where={"id": documentId},
        )
        return {"success": True, "data": document}
    except Exception as e:
        logger.error(f"Couldn't patch document with id {documentId}", exc_info=e)

    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
