from prefect import task, flow
from decouple import config
from app.utils.prisma import prisma
from prisma.models import Datasource
from llama import LLMEngine, Type, Context
from app.datasource.loader import DataLoader


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
