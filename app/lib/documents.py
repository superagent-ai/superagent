import tempfile
from tempfile import NamedTemporaryFile
from urllib.parse import urlparse

import requests
from langchain.document_loaders import (
    GitLoader,
    TextLoader,
    UnstructuredMarkdownLoader,
    WebBaseLoader,
    YoutubeLoader,
)
from llama_index import download_loader

from app.lib.loaders.sitemap import SitemapLoader
from app.lib.parsers import CustomPDFPlumberLoader
from app.lib.splitters import TextSplitters
from app.lib.vectorstores.base import VectorStoreBase

NotionPageReader = download_loader("NotionPageReader")

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
    "NOTION",
]


def chunkify(lst, size):
    """Divide a list into chunks of given size."""
    return [lst[i : i + size] for i in range(0, len(lst), size)]


def load_documents(type, metadata, url, content, from_page, to_page):
    if type == "STRIPE":
        return []

    if type == "NOTION":
        integration_token = metadata["integration_token"]
        page_ids = metadata["page_ids"]
        loader = NotionPageReader(integration_token=integration_token)
        return loader.load_langchain_documents(page_ids=page_ids.split(","))

    if type == "AIRTABLE":
        from langchain.document_loaders import AirtableLoader

        loader = AirtableLoader(
            metadata["api_key"], metadata["table_id"], metadata["base_id"]
        )
        return loader.load()

    if type == "SITEMAP":
        filter_urls: str = metadata["filter_urls"]
        loader = SitemapLoader(sitemap_url=url, filter_urls=filter_urls.split(","))
        return loader.load()

    if type == "WEBPAGE":
        from llama_index import download_loader

        RemoteDepthReader = download_loader("RemoteDepthReader")
        depth = int(metadata["depth"])
        loader = RemoteDepthReader(depth=depth)
        return loader.load_langchain_documents(url=url)

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
                return loader.load()
        else:
            raise ValueError("file_response must not be None.")

    if type == "PDF":
        if url is None:
            raise ValueError("URL must not be None for PDF type.")
        loader = CustomPDFPlumberLoader(
            file_path=url, from_page=from_page, to_page=to_page
        )
        return loader.load()

    if type == "URL":
        if url is None:
            raise ValueError("URL must not be None for URL type.")
        url_list = url.split(",")
        loader = WebBaseLoader(url_list)
        return loader.load()

    if type == "YOUTUBE":
        if url is None:
            raise ValueError("URL must not be None for YOUTUBE type.")
        video_id = url.split("youtube.com/watch?v=")[-1]
        loader = YoutubeLoader(video_id=video_id)
        return loader.load()

    if type == "MARKDOWN":
        if url is None:
            raise ValueError("URL must not be None for MARKDOWN type.")
        file_response = requests.get(url).text

        if file_response:
            with NamedTemporaryFile(suffix=".md", delete=True) as temp_file:
                temp_file.write(file_response.encode())
                temp_file.flush()
                loader = UnstructuredMarkdownLoader(file_path=temp_file.name)
                return loader.load()

        else:
            raise ValueError("file_response must not be None.")

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
            return loader.load_and_split()

    return []


def embed_documents(documents, document_id, text_splitter):
    newDocuments = [
        document.metadata.update({"document_id": document_id}) or document
        for document in documents
    ]
    docs = TextSplitters(newDocuments, text_splitter).document_splitter()
    VectorStoreBase().get_database().embed_documents(docs)


def upsert_document(
    type: str,
    document_id: str,
    from_page: int,
    to_page: int,
    url: str | None = None,
    content: str | None = None,
    text_splitter: dict | None = None,
    metadata=None,
):
    """Upserts documents to Pinecone index"""
    documents = load_documents(type, metadata, url, content, from_page, to_page)

    if documents:
        embed_documents(documents, document_id, text_splitter)
