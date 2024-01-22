import logging
import os
from typing import Optional

from decouple import config
from fastapi import APIRouter, Depends
from bigquery import get_client
from bigquery.query_builder import render_query
from bigquery.errors import BigQueryTimeoutException

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
    # service_key_path = "/etc/secrets/service_key.json"
    project_root = os.path.dirname(os.path.dirname(__file__))
    service_key_path = os.path.join(project_root, "google_cloud_service_key.json")

    client = get_client(json_key_file=service_key_path, readonly=True)
    try:
        having = [
            {
                "field": "user_id",
                "type": "STRING",
                "comparators": [
                    {"condition": "==", "negate": False, "value": api_user.id}
                ],
            }
        ]
        if agent_id is not None:
            having.append(
                {
                    "field": "agent_id",
                    "type": "STRING",
                    "comparators": [
                        {
                            "condition": "==",
                            "negate": False,
                            "value": agent_id,
                        }
                    ],
                }
            )
        query = render_query(
            "website_prod",
            ["invoked_agent"],
            having=having,
        )
        _, results = client.query(query, timeout=10)
    except BigQueryTimeoutException:
        print("timeout")
    return {"success": True, "data": results or []}
