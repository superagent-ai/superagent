import logging
import os
from typing import Optional

from fastapi import APIRouter, Depends
from google.cloud import bigquery

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
    agent_id: Optional[str] = None,
    api_user=Depends(get_current_api_user),
    from_page: Optional[int] = None,
    to_page: Optional[int] = None,
    limit: Optional[int] = None,
):
    """Endpoint for listing agent runs"""
    project_root = os.path.dirname(os.path.dirname(__file__))
    service_key_path = os.path.join(project_root, "google_cloud_service_key.json")
    client = bigquery.Client.from_service_account_json(service_key_path)
    query = """
        SELECT * FROM `website_prod.invoked_agent`
        WHERE user_id = @user_id AND agent_id IS NOT NULL
    """
    params = [
        bigquery.ScalarQueryParameter("user_id", "STRING", api_user.id),
    ]

    if agent_id is not None:
        query += " AND agent_id = @agent_id"
        params.append(bigquery.ScalarQueryParameter("agent_id", "STRING", agent_id))

    # Add ORDER BY clause to sort by timestamp in descending order
    query += " ORDER BY timestamp DESC"

    if from_page is not None and to_page is not None:
        offset = (from_page - 1) * limit
        rows = (to_page - from_page + 1) * limit
        query += " LIMIT @rows OFFSET @offset"
        params.append(bigquery.ScalarQueryParameter("rows", "INT64", rows))
        params.append(bigquery.ScalarQueryParameter("offset", "INT64", offset))
    elif limit is not None:
        query += " LIMIT @limit"
        params.append(bigquery.ScalarQueryParameter("limit", "INT64", limit))

    job_config = bigquery.QueryJobConfig()
    job_config.query_parameters = params
    query_job = client.query(query, job_config=job_config)

    row_iterator = query_job.result()
    results = [dict(row) for row in row_iterator]
    return {"success": True, "data": results or []}
