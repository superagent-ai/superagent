from typing import Any, Literal, Optional

from decouple import config
from langchain.docstore.document import Document

from app.utils.helpers import get_first_non_null
from app.vectorstores.astra import AstraVectorStore
from app.vectorstores.pinecone import PineconeVectorStore
from app.vectorstores.qdrant import QdrantVectorStore
from app.vectorstores.weaviate import WeaviateVectorStore
from prisma.enums import VectorDbProvider

vector_db_mapping = {
    "pinecone": "PINECONE",
    "qdrant": "QDRANT",
    "astra": "ASTRA_DB",
    "weaviate": "WEAVIATE",
}


# NOTE: Need an abstract class for the base vectorstore with defined methods
class VectorStoreBase:
    def __init__(self, options: Optional[dict], vector_db_provider: Optional[str]):
        """
        Determine the vectorstore
        """
        self.options = options
        self.vectorstore = get_first_non_null(
            vector_db_mapping.get(config("VECTORSTORE", None)),
            vector_db_provider,
            VectorDbProvider.PINECONE.value,
        )
        self.instance = self.get_database()

    def get_database(self, index_name: Optional[str] = None) -> Any:
        vectorstore_classes = {
            "PINECONE": PineconeVectorStore,
            "ASTRA_DB": AstraVectorStore,
            "WEAVIATE": WeaviateVectorStore,
            "QDRANT": QdrantVectorStore,
        }
        index_names = {
            "PINECONE": get_first_non_null(
                config("PINECONE_INDEX", None),
                self.options.get("PINECONE_INDEX"),
                "superagent",
            ),
            "ASTRA_DB": get_first_non_null(
                config("ASTRA_DB_COLLECTION_NAME", None),
                self.options.get("ASTRA_DB_COLLECTION_NAME"),
                "superagent",
            ),
            "WEAVIATE": get_first_non_null(
                config("WEAVIATE_INDEX", None),
                self.options.get("WEAVIATE_INDEX"),
                "superagent",
            ),
            "QDRANT": get_first_non_null(
                config("QDRANT_INDEX", None),
                self.options.get("QDRANT_INDEX"),
                "superagent",
            ),
        }

        if index_name is None:
            index_name = index_names.get(self.vectorstore)
        return vectorstore_classes.get(self.vectorstore)(
            index_name=index_name, options=self.options
        )

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
