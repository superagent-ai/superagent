import pinecone
from decouple import config
from langchain.vectorstores.pinecone import Pinecone

pinecone.init(
    api_key=config("PINECONE_API_KEY"),  # find at app.pinecone.io
    environment=config("PINECONE_ENVIRONMENT"),  # next to api key in console
)

pinecone.Index("aidosys")


class PineconeVectorstore:
    def __init__(self):
        pass

    def from_documents(self, docs, embeddings, index_name, namespace):
        Pinecone.from_documents(
            docs, embeddings, index_name="aidosys", namespace=namespace
        )

    def from_existing_index(self, embeddings, namespeace):
        return Pinecone.from_existing_index(
            "aidosys", embedding=embeddings, namespace=namespeace
        )
