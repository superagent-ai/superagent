import pinecone
import requests
from decouple import config
from langchain.document_loaders import TextLoader, WebBaseLoader
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from app.lib.vectorstores.base import VectorStoreBase

from app.lib.parsers import CustomPDFPlumberLoader

valid_ingestion_types = ["TXT", "PDF", "URL"]


def upsert_document(
    url: str, type: str, document_id: str, from_page: int, to_page: int
) -> None:
    """Upserts documents to Pinecone index"""
    pinecone.Index("superagent")

    embeddings = OpenAIEmbeddings()

    if type == "TXT":
        file_response = requests.get(url)
        loader = TextLoader(file_response.content)
        documents = loader.load()
        newDocuments = [document.metadata.update({"namespace": document_id}) or document for document in documents]
        text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
        docs = text_splitter.split_documents(newDocuments)

        VectorStoreBase().get_database().from_documents(docs, embeddings, index_name="superagent", namespace=document_id)

    if type == "PDF":
        loader = CustomPDFPlumberLoader(
            file_path=url, from_page=from_page, to_page=to_page
        )
        documents = loader.load()
        newDocuments = [document.metadata.update({"namespace": document_id}) or document for document in documents]
        text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
        docs = text_splitter.split_documents(newDocuments)

        VectorStoreBase().get_database().from_documents(docs, embeddings, index_name="superagent", namespace=document_id)

    if type == "URL":
        loader = WebBaseLoader(url)
        documents = loader.load()
        newDocuments = [document.metadata.update({"namespace": document_id}) or document for document in documents]
        text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
        docs = text_splitter.split_documents(newDocuments)

        VectorStoreBase().get_database().from_documents(docs, embeddings, index_name="superagent", namespace=document_id)