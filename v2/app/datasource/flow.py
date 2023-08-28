from prefect import task, flow
from decouple import config
from typing import Any, List
from app.utils.prisma import prisma
from prisma.models import AgentDatasource, Datasource
from llama import LLMEngine, Type, Context
from app.datasource.loader import DataLoader

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
async def handle_finetune(datasource: Datasource):
    print(f"FINETUNE: {datasource.id}")
    data_loader = DataLoader(datasource)
    data = data_loader.load()
    llm = LLMEngine(
        id="QA",
        config={"production.key": config("LAMINI_API_KEY")},
        model_name="chat/gpt-3.5-turbo",
    )
    documents = [
        Document(text=document.page_content, metadata=document.metadata)
        for document in data
    ]
    return llm.save_data(documents)


@task
async def handle_vectorization(datasource: Datasource):
    print(f"VECTORIZE: {datasource.id}")


@task
async def handle_datasources(
    agent_datasources: List[AgentDatasource], agent_id: str
) -> Any:
    llm = LLMEngine(
        id=agent_id,
        config={"production.key": config("LAMINI_API_KEY")},
        model_name="chat/gpt-3.5-turbo",
    )
    llm.clear_data()
    llm.save_data(
        [
            DataLoader(agent_datasource.datasource).load()
            for agent_datasource in agent_datasources
            if agent_datasource.datasource.type in VALID_FINETUNE_TYPES
        ]
    )
    return llm


@flow(name="process_datasource", description="Process new agent datasource", retries=0)
async def process_datasource(datasource_id: str, agent_id: str):
    await prisma.agentdatasource.create(
        {"datasourceId": datasource_id, "agentId": agent_id}
    )
    agent_datasources = await prisma.agentdatasource.find_many(
        where={"agentId": agent_id}, include={"datasource": True}
    )
    callback = await handle_datasources(
        agent_datasources=agent_datasources, agent_id=agent_id
    )
    print(f"CALLBACK: {callback}")
