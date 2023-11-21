from decouple import config
from qdrant_client import QdrantClient
from langchain.docstore.document import Document
from langchain.embeddings.openai import OpenAIEmbeddings  # type: ignore
from pydantic.dataclasses import dataclass


class QdrantVectorStore:
    def __init__(self, index_name: str = None) -> None:
        self.index_name = index_name
        self.client = QdrantClient(
            url=config(
                "QDRANT_HOST",
                "https://xxxxxx-xxxxx-xxxxx-xxxx-xxxxxxxxx.us-east.aws.cloud.qdrant.io:6333",
            ),
            api_key=config("QDRANT_API_KEY", ""),
        )
        self.embeddings = OpenAIEmbeddings(
            model="text-embedding-ada-002", openai_api_key=config("OPENAI_API_KEY")
        )

        logger.info(f"Initialized Qdrant Client with: {index_name}")  # type: ignore

    def _similarity_search_by_vector():
        pass

    def embed_documents():
        pass

    def query_documents():
        pass
