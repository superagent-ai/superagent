import os
from typing import Any, Literal, Optional

from decouple import config
from langchain.docstore.document import Document

from app.vectorstores.astra import AstraVectorStore
from app.vectorstores.pinecone import PineconeVectorStore
from app.vectorstores.weaviate import WeaviateVectorStore

# NOTE: Need an abstract class for the base vectorstore with defined methods


class VectorStoreBase:
    def __init__(self):
        """
        Determine the vectorstore
        """
        self.vectorstore = config("VECTORSTORE", default="pinecone")
        self.instance = self.get_database()

    def get_database(self, index_name: Optional[str] = None) -> Any:
        vectorstore_classes = {
            "pinecone": PineconeVectorStore,
            "astra": AstraVectorStore,
            "weaviate": WeaviateVectorStore,
        }
        index_names = {
            "pinecone": config("PINECONE_INDEX", "superagent"),
            "astra": config("COLLECTION_NAME", "superagent"),
            "weaviate": config("WEAVIATE_INDEX", "superagent"),
        }
        if index_name is None:
            index_name = index_names.get(self.vectorstore)
        return vectorstore_classes.get(self.vectorstore)(index_name=index_name)

    def query(
        self,
        prompt: str,
        metadata_filter: dict | None = None,
        top_k: int = 5,
        namespace: str | None = None,
        min_score: float | None = None,  # new argument for minimum similarity score
    ):
        return self.instance.query(prompt, metadata_filter, top_k, namespace, min_score)

    def query_documents(
        self,
        prompt: str,
        datasource_id: str,
        top_k: int | None,
        query_type: Literal["document", "all"] = "document",
    ):
        return self.instance.query_documents(prompt, datasource_id, top_k, query_type)

    def delete(self, datasource_id: str):
        self.instance.delete(datasource_id)

    # @backoff.on_exception(backoff.expo, Exception, max_tries=3)
    # def _embed_with_retry(self, texts):
    #     return self.instance.embeddings.embed_documents(texts)

    def embed_documents(self, documents: list[Document], batch_size: int = 20):
        self.instance.embed_documents(documents, batch_size)

    def clear_cache(self, agent_id: str, datasource_id: str | None = None):
        self.instance.clear_cache(agent_id, datasource_id)
