from prefect import task, flow
from app.utils.prisma import prisma
from prisma.models import Datasource


@task
async def handle_finetune(datasource: Datasource):
    print(f"FINETUNE: {datasource.id}")


@task
async def handle_vectorization(datasource: Datasource):
    print(f"VECTORIZE: {datasource.id}")


@task
async def create_agent_datasource(datasource_id: str, agent_id: str):
    await prisma.agentdatasource.create(
        {"datasourceId": datasource_id, "agentId": agent_id}
    )


VALID_INGESTION_TYPES = {
    "TXT": handle_finetune,
    "PDF": handle_finetune,
    "MARKDOWN": handle_finetune,
    "GITHUB_REPOSITORY": handle_finetune,
    "WEBPAGE": handle_finetune,
    "NOTION": handle_finetune,
}


@flow(name="process_datasource", description="Process new agent datasource", retries=0)
async def process_datasource(datasource_id: str, agent_id: str):
    datasource = await prisma.datasource.find_unique_or_raise(
        where={"id": datasource_id}
    )
    handler = VALID_INGESTION_TYPES.get(datasource.type, handle_vectorization)
    await handler(datasource=datasource)
    await prisma.agentdatasource.create(
        {"datasourceId": datasource_id, "agentId": agent_id}
    )
