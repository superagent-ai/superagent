from tempfile import NamedTemporaryFile

import pinecone
import requests
from langchain.document_loaders import (
    TextLoader,
    UnstructuredMarkdownLoader,
    WebBaseLoader,
    YoutubeLoader,
)
from langchain.embeddings.openai import OpenAIEmbeddings

from app.lib.parsers import CustomPDFPlumberLoader
from app.lib.splitters import TextSplitters
from app.lib.vectorstores.base import VectorStoreBase

valid_ingestion_types = ["TXT", "PDF", "URL", "YOUTUBE", "MARKDOWN"]


def upsert_document(
    url: str,
    type: str,
    document_id: str,
    from_page: int,
    to_page: int,
    text_splitter: dict = None,
) -> None:
    """Upserts documents to Pinecone index"""
    pinecone.Index("superagent")

    embeddings = OpenAIEmbeddings()

    if type == "TXT":
        file_response = requests.get(url)
        with NamedTemporaryFile(suffix=".txt", delete=True) as temp_file:
            temp_file.write(file_response.text.encode())
            temp_file.flush()
            loader = TextLoader(file_path=temp_file.name)
            documents = loader.load()
        newDocuments = [
            document.metadata.update({"namespace": document_id}) or document
            for document in documents
        ]
        docs = TextSplitters(newDocuments, text_splitter).document_splitter()

        VectorStoreBase().get_database().from_documents(
            docs, embeddings, index_name="superagent", namespace=document_id
        )

    if type == "PDF":
        loader = CustomPDFPlumberLoader(
            file_path=url, from_page=from_page, to_page=to_page
        )
        documents = loader.load()
        newDocuments = [
            document.metadata.update({"namespace": document_id}) or document
            for document in documents
        ]
        docs = TextSplitters(newDocuments, text_splitter).document_splitter()

        VectorStoreBase().get_database().from_documents(
            docs, embeddings, index_name="superagent", namespace=document_id
        )

    if type == "URL":
        loader = WebBaseLoader(url)
        documents = loader.load()
        newDocuments = [
            document.metadata.update({"namespace": document_id, "language": "en"})
            or document
            for document in documents
        ]
        docs = TextSplitters(newDocuments, text_splitter).document_splitter()

        VectorStoreBase().get_database().from_documents(
            docs, embeddings, index_name="superagent", namespace=document_id
        )

    if type == "YOUTUBE":
        video_id = url.split("youtube.com/watch?v=")[-1]
        loader = YoutubeLoader(video_id=video_id)
        documents = loader.load()
        newDocuments = [
            document.metadata.update({"namespace": document_id}) or document
            for document in documents
        ]
        docs = TextSplitters(newDocuments, text_splitter).document_splitter()

        VectorStoreBase().get_database().from_documents(
            docs, embeddings, index_name="superagent", namespace=document_id
        )

    if type == "MARKDOWN":
        file_response = requests.get(url)
        with NamedTemporaryFile(suffix=".md", delete=True) as temp_file:
            temp_file.write(file_response.text.encode())
            temp_file.flush()
            loader = UnstructuredMarkdownLoader(file_path=temp_file.name)
            documents = loader.load()

        newDocuments = [
            document.metadata.update({"namespace": document_id}) or document
            for document in documents
        ]
        docs = TextSplitters(newDocuments, text_splitter).document_splitter()

        VectorStoreBase().get_database().from_documents(
            docs, embeddings, index_name="superagent", namespace=document_id
        )
