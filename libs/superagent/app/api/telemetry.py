import logging
from typing import Optional

import requests
from decouple import config
from fastapi import APIRouter, Depends

from app.models.response import AgentRunList as AgentRunListResponse
from app.utils.api import get_current_api_user

router = APIRouter()
logging.basicConfig(level=logging.INFO)


@router.get(
    "/runs",
    name="list_runs",
    description="List runs",
    response_model=AgentRunListResponse,
)
async def list_runs(
    agent_id: Optional[str] = None, api_user=Depends(get_current_api_user)
):
    """Endpoint for listing agent runs"""
    url = "https://cloud.langfuse.com/api/public/observations"
    query_params = {"userId": api_user.id, "tags": [agent_id], "limit": 100}
    import base64

    username = config("LANGFUSE_PUBLIC_KEY")
    password = config("LANGFUSE_SECRET_KEY")
    credentials = base64.b64encode(f"{username}:{password}".encode("utf-8")).decode(
        "utf-8"
    )
    auth_headers = {"Authorization": f"Basic {credentials}"}
    all_data = []
    page = 1
    # Add filter on tags
    while True:
        query_params.update({"page": page})
        response = requests.get(url, params=query_params, headers=auth_headers)
        output = response.json()
        data = output.get("data", [])
        filtered_data = [
            item
            for item in data
            if item.get("parentObservationId") is None
            and agent_id in item.get("traceId", "")
        ]
        all_data.extend(filtered_data)
        if page >= output["meta"].get("totalPages", 0):
            break
        page += 1
    output = all_data
    return {"success": True, "data": output}
