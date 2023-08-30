from typing import List

from decouple import config
from llama import Context, LLMEngine, Type
from prefect import flow, task

from app.datasource.loader import DataLoader
from app.utils.prisma import prisma
from prisma.models import AgentDatasource

VALID_FINETUNE_TYPES = [
    "TXT",
    "PDF",
    "MARKDOWN",
    "GITHUB_REPOSITORY",
    "WEBPAGE",
    "NOTION",
]


class Document(Type):
    text: str = Context("A document")
    metadata: dict = Context("Metadata associated with the document")


@task
async def handle_datasources(
    agent_datasources: List[AgentDatasource], agent_id: str
) -> None:
    llm = LLMEngine(
        id=agent_id,
        config={"production.key": config("LAMINI_API_KEY")},
        model_name="chat/gpt-3.5-turbo",
    )
    llm.clear_data()
    for agent_datasource in agent_datasources:
        if agent_datasource.datasource.type in VALID_FINETUNE_TYPES:
            data = DataLoader(agent_datasource.datasource).load()
            documents = [
                Document(text=document.page_content, metadata=document.metadata)
                for document in data
            ]
            llm.save_data(documents)


@flow(name="process_datasource", description="Process new agent datasource", retries=0)
async def process_datasource(datasource_id: str, agent_id: str):
    await prisma.agentdatasource.create(
        {"datasourceId": datasource_id, "agentId": agent_id}
    )
    agent_datasources = await prisma.agentdatasource.find_many(
        where={"agentId": agent_id}, include={"datasource": True}
    )
    await handle_datasources(agent_datasources=agent_datasources, agent_id=agent_id)


@flow(name="revalidate_datasource", description="Revalidate datasources", retries=0)
async def revalidate_datasource(agent_id: str):
    agent_datasources = await prisma.agentdatasource.find_many(
        where={"agentId": agent_id}, include={"datasource": True}
    )
    await handle_datasources(agent_datasources=agent_datasources, agent_id=agent_id)
