import pinecone
from decouple import config
from langchain.vectorstores.pinecone import Pinecone

pinecone.init(
    api_key=config("PINECONE_API_KEY"),  # find at app.pinecone.io
    environment=config("PINECONE_ENVIRONMENT"),  # next to api key in console
)


INDEX_NAME = config("PINECONE_INDEX", "superagent")
index = pinecone.Index(INDEX_NAME)


class PineconeVectorstore:
    def __init__(self):
        pass

    def from_documents(self, docs, embeddings, index_name, namespace):
        Pinecone.from_documents(
            docs, embeddings, index_name=index_name, namespace=namespace
        )

    def from_existing_index(self, embeddings, namespace):
        return Pinecone.from_existing_index(
            INDEX_NAME, embedding=embeddings, namespace=namespace
        )

    def delete(self, namespace):
        return index.delete(delete_all=True, namespace=namespace)
