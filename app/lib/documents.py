import tempfile
from tempfile import NamedTemporaryFile
from urllib.parse import urlparse

import pinecone
import requests  # type: ignore
from decouple import config
from langchain.document_loaders import (
    GitLoader,
    PsychicLoader,
    TextLoader,
    UnstructuredMarkdownLoader,
    WebBaseLoader,
    YoutubeLoader,
)
from langchain.embeddings.openai import OpenAIEmbeddings
from llama_index.readers.schema.base import Document

from app.lib.loaders.sitemap import SitemapLoader
from app.lib.parsers import CustomPDFPlumberLoader
from app.lib.splitters import TextSplitters
from app.lib.vectorstores.base import VectorStoreBase

valid_ingestion_types = [
    "TXT",
    "PDF",
    "URL",
    "YOUTUBE",
    "MARKDOWN",
    "FIRESTORE",
    "PSYCHIC",
    "GITHUB_REPOSITORY",
    "WEBPAGE",
    "STRIPE",
    "AIRTABLE",
    "SITEMAP",
]


def chunkify(lst, size):
    """Divide a list into chunks of given size."""
    return [lst[i : i + size] for i in range(0, len(lst), size)]


def upsert_document(
    type: str,
    document_id: str,
    from_page: int,
    to_page: int,
    url: str | None = None,
    content: str | None = None,
    text_splitter: dict | None = None,
    user_id: str | None = None,
    authorization: dict | None = None,
    metadata: dict | None = None,
) -> None:
    """Upserts documents to Pinecone index"""

    INDEX_NAME = config("PINECONE_INDEX", "superagent")

    pinecone.Index(INDEX_NAME)

    embeddings = OpenAIEmbeddings()

    if type == "STRIPE":
        pass

    if type == "AIRTABLE":
        from langchain.document_loaders import AirtableLoader

        api_key = metadata["api_key"]
        base_id = metadata["base_id"]
        table_id = metadata["table_id"]
        loader = AirtableLoader(api_key, table_id, base_id)
        documents = loader.load()
        newDocuments = [
            document.metadata.update({"namespace": document_id}) or document
            for document in documents
        ]
        docs = TextSplitters(newDocuments, text_splitter).document_splitter()

        VectorStoreBase().get_database().from_documents(
            docs, embeddings, index_name=INDEX_NAME, namespace=document_id
        )

    if type == "SITEMAP":
        filter_urls = metadata["filter_urls"].split(",")
        loader = SitemapLoader(sitemap_url=url, filter_urls=filter_urls)
        documents = loader.load()
        newDocuments = [
            document.metadata.update({"namespace": document_id}) or document
            for document in documents
        ]
        docs = TextSplitters(newDocuments, text_splitter).document_splitter()

        chunk_size = 100
        chunks = chunkify(docs, chunk_size)

        for chunk in chunks:
            VectorStoreBase().get_database().from_documents(
                chunk, embeddings, index_name=INDEX_NAME, namespace=document_id
            )

    if type == "WEBPAGE":
        from llama_index import download_loader

        RemoteDepthReader = download_loader("RemoteDepthReader")
        depth = int(metadata["depth"])
        loader = RemoteDepthReader(depth=depth)
        documents = loader.load_data(url=url)
        langchain_documents = [d.to_langchain_format() for d in documents]
        newDocuments = [
            document.metadata.update({"namespace": document_id}) or document
            for document in langchain_documents
        ]
        docs = TextSplitters(newDocuments, text_splitter).document_splitter()
        chunk_size = 100
        chunks = chunkify(docs, chunk_size)

        for chunk in chunks:
            VectorStoreBase().get_database().from_documents(
                chunk, embeddings, index_name=INDEX_NAME, namespace=document_id
            )

    if type == "TXT":
        file_response = content
        if content is None:
            if url is None:
                raise ValueError("URL must not be None when content is None.")
            file_response = requests.get(url).text

        if file_response is not None:
            with NamedTemporaryFile(suffix=".txt", delete=True) as temp_file:
                temp_file.write(file_response.encode())
                temp_file.flush()
                loader = TextLoader(file_path=temp_file.name)
                documents = loader.load()
        else:
            raise ValueError("file_response must not be None.")

        newDocuments = [
            document.metadata.update({"namespace": document_id}) or document
            for document in documents
        ]
        docs = TextSplitters(newDocuments, text_splitter).document_splitter()

        VectorStoreBase().get_database().from_documents(
            docs, embeddings, index_name=INDEX_NAME, namespace=document_id
        )

    if type == "PDF":
        if url is None:
            raise ValueError("URL must not be None for PDF type.")
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
            docs, embeddings, index_name=INDEX_NAME, namespace=document_id
        )

    if type == "URL":
        if url is None:
            raise ValueError("URL must not be None for URL type.")
        url_list = url.split(",")
        loader = WebBaseLoader(url_list)
        documents = loader.load()
        newDocuments = [
            document.metadata.update({"namespace": document_id, "language": "en"})
            or document
            for document in documents
        ]
        docs = TextSplitters(newDocuments, text_splitter).document_splitter()

        VectorStoreBase().get_database().from_documents(
            docs, embeddings, index_name=INDEX_NAME, namespace=document_id
        )

    if type == "YOUTUBE":
        if url is None:
            raise ValueError("URL must not be None for YOUTUBE type.")
        video_id = url.split("youtube.com/watch?v=")[-1]
        loader = YoutubeLoader(video_id=video_id)
        documents = loader.load()
        newDocuments = [
            document.metadata.update({"namespace": document_id}) or document
            for document in documents
        ]
        docs = TextSplitters(newDocuments, text_splitter).document_splitter()

        VectorStoreBase().get_database().from_documents(
            docs, embeddings, index_name=INDEX_NAME, namespace=document_id
        )

    if type == "MARKDOWN":
        if url is None:
            raise ValueError("URL must not be None for MARKDOWN type.")
        file_response = requests.get(url).text
        if file_response:
            with NamedTemporaryFile(suffix=".md", delete=True) as temp_file:
                temp_file.write(file_response.encode())
                temp_file.flush()
                loader = UnstructuredMarkdownLoader(file_path=temp_file.name)
        else:
            raise ValueError("file_response must not be None.")

        newDocuments = [
            document.metadata.update({"namespace": document_id}) or document
            for document in documents
        ]
        docs = TextSplitters(newDocuments, text_splitter).document_splitter()

        VectorStoreBase().get_database().from_documents(
            docs, embeddings, index_name=INDEX_NAME, namespace=document_id
        )

    if type == "PSYCHIC":
        if metadata is not None:
            connector_id = metadata["connectorId"]
        else:
            connector_id = None  # or some default value

        loader = PsychicLoader(
            api_key=config("PSYCHIC_API_KEY"),
            account_id=user_id,
            connector_id=connector_id,
        )
        documents = loader.load()
        newDocuments = [
            document.metadata.update({"namespace": document_id}) or document
            for document in documents
        ]
        docs = TextSplitters(newDocuments, text_splitter).document_splitter()

        VectorStoreBase().get_database().from_documents(
            docs, embeddings, index_name=INDEX_NAME, namespace=document_id
        )

    if type == "FIRESTORE":
        from google.cloud import firestore
        from google.oauth2 import service_account

        credentials = service_account.Credentials.from_service_account_info(
            authorization
        )
        if authorization is None:
            raise ValueError("Authorization must not be None for FIRESTORE type.")
        db = firestore.Client(
            credentials=credentials, project=authorization["project_id"]
        )
        documents = []
        if metadata is None:
            raise ValueError("Metadata must not be None for FIRESTORE type.")
        col_ref = db.collection(metadata["collection"])

        for doc in col_ref.stream():
            doc_str = ", ".join([f"{k}: {v}" for k, v in doc.to_dict().items()])
            documents.append(Document(text=doc_str))

        VectorStoreBase().get_database().from_documents(
            documents, embeddings, index_name=INDEX_NAME, namespace=document_id
        )

    if type == "GITHUB_REPOSITORY":
        parsed_url = urlparse(url)
        path_parts = parsed_url.path.split("/")  # type: ignore
        repo_name = path_parts[2]

        with tempfile.TemporaryDirectory() as temp_dir:
            repo_path = f"{temp_dir}/{repo_name}/"  # type: ignore
            loader = GitLoader(
                clone_url=url,
                repo_path=repo_path,
                branch=metadata["branch"],  # type: ignore
            )
            docs = loader.load_and_split()

        VectorStoreBase().get_database().from_documents(
            docs, embeddings, index_name=INDEX_NAME, namespace=document_id
        )
