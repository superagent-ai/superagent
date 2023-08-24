import logging
from fastapi import HTTPException, status

logger = logging.getLogger(__name__)


def handle_exception(e):
    logger.error(e)
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
    )
