from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security.api_key import APIKey
from app.lib.auth.api import get_api_key
from app.lib.models.document import Document

router = APIRouter()


@router.post("/documents/", name="Create document", description="Create a new document")
async def create_document(body: Document, api_key: APIKey = Depends(get_api_key)):
    """Create document endpoint"""

    try:
        pass

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e,
        )
