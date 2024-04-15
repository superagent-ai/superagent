from enum import Enum
from typing import Optional
from urllib.parse import unquote, urlparse

import requests
from decouple import config
from pydantic import BaseModel

from app.api.workflow_configs.exceptions import UnkownFileType


# Source https://github.com/superagent-ai/super-rag/blob/bb1630be981b075d8be0585adfc2e697105f510f/models/file.py
class FileType(Enum):
    pdf = "PDF"
    docx = "DOCX"
    txt = "TXT"
    pptx = "PPTX"
    md = "MARKDOWN"
    csv = "CSV"
    xlsx = "XLSX"
    html = "HTML"
    json = "JSON"
    eml = "EML"
    msg = "MSG"

    def suffix(self) -> str:
        suffixes = {
            "TXT": ".txt",
            "PDF": ".pdf",
            "MARKDOWN": ".md",
            "DOCX": ".docx",
            "CSV": ".csv",
            "XLSX": ".xlsx",
            "PPTX": ".pptx",
            "HTML": ".html",
            "JSON": ".json",
            "EML": ".eml",
            "MSG": ".msg",
        }
        return suffixes[self.value]


class File(BaseModel):
    url: str
    name: str | None = None

    @property
    def type(self) -> FileType | None:
        url = self.url
        if url:
            parsed_url = urlparse(url)
            path = unquote(parsed_url.path)
            extension = path.split(".")[-1].lower()
            try:
                return FileType[extension]
            except KeyError:
                supported_file_types = ", ".join(
                    [file_type.value for file_type in FileType]
                )
                raise UnkownFileType(
                    f"Unknown file type for URL {url}. "
                    f"Supported file types are: {supported_file_types}"
                )
        return None

    @property
    def suffix(self) -> str:
        file_type = self.type
        if file_type is not None:
            return file_type.suffix()
        else:
            raise ValueError("File type is undefined, cannot determine suffix.")


class SuperRagService:
    def __init__(self, url: Optional[str] = None):
        self.url = url or config("SUPERRAG_API_URL")

        if not self.url:
            raise ValueError("SUPERRAG_API_URL is not set")

    def _request(self, method, endpoint, data):
        return requests.request(method, f"{self.url}/{endpoint}", json=data).json()

    def ingest(self, data):
        return self._request(
            "POST",
            "ingest",
            data,
        )

    def delete(self, data):
        return self._request(
            "DELETE",
            "delete",
            data,
        )

    def query(self, data):
        return self._request(
            "POST",
            "query",
            data,
        )
