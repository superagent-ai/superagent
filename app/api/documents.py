import hashlib
import json
import logging

from fastapi import APIRouter, Depends, HTTPException, status

from app.lib.auth.prisma import JWTBearer
from app.lib.documents import upsert_document, valid_ingestion_types
from app.lib.models.document import Document
from app.lib.prisma import prisma
from app.lib.vectorstores.base import VectorStoreBase

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
                "description": body.description,
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
        return {"success": True, "data": document}
    except Exception as e:
        logger.error("Couldn't create document", exc_info=e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


@router.get("/documents", name="List documents", description="List all documents")
async def read_documents(token=Depends(JWTBearer())):
    """List documents endpoint"""
    documents = prisma.document.find_many(
        where={"userId": token["userId"]},
        include={"user": True},
        order={"createdAt": "desc"},
    )
    return {"success": True, "data": documents}


@router.get(
    "/documents/{documentId}",
    name="Get document",
    description="Get a specific document",
)
async def read_document(documentId: str, token=Depends(JWTBearer())):
    """Get a single document"""
    document = prisma.document.find_unique(
        where={"id": documentId}, include={"user": True}
    )
    return {"success": True, "data": document}


@router.delete(
    "/documents/{documentId}",
    name="Delete document",
    description="Delete a specific document",
)
async def delete_document(documentId: str, token=Depends(JWTBearer())):
    """Delete a document"""
    try:
        prisma.agentdocument.delete_many(where={"documentId": documentId})
        prisma.document.delete(where={"id": documentId})
        VectorStoreBase().get_database().delete(namespace=documentId)
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
