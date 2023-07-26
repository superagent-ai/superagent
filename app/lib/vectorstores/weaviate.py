import weaviate
from decouple import config
from langchain.vectorstores.weaviate import Weaviate
from langchain.retrievers.weaviate_hybrid_search import WeaviateHybridSearchRetriever


auth_config = weaviate.AuthApiKey(api_key=config("WEAVIATE_API_KEY"))
weaviate_client = weaviate.Client(
    url=config("WEAVIATE_URL"), auth_client_secret=auth_config
)


class WeaviateVectorStore:
    def __init__(self):
        pass

    def from_documents(self, docs, embeddings, namespace):
        return Weaviate.from_documents(
            client=weaviate_client,
            documents=docs,
            index_name="superagent",
            embedding=embeddings,
            namespace=namespace,
        )

    def from_existing_index(self, embeddings, namespace):
        return WeaviateHybridSearchRetriever(
            client=weaviate_client,
            index_name="superagent",
            text_key="text",
            attributes=[],
            create_schema_if_missing=True,
            namespace=namespace,
        )
