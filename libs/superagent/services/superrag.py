from enum import Enum
from typing import Optional
from urllib.parse import unquote, urlparse

from aiohttp import ClientSession
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
    name: Optional[str] = None

    @property
    def type(self) -> Optional[FileType]:
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

    async def _arequest(self, method, endpoint, data):
        async with ClientSession() as session:
            async with session.request(
                method, f"{self.url}/{endpoint}", json=data
            ) as response:
                return await response.json()

    async def aingest(self, data):
        return await self._arequest(
            "POST",
            "ingest",
            data,
        )

    async def adelete(self, data):
        return await self._arequest(
            "DELETE",
            "delete",
            data,
        )

    async def aquery(self, data):
        return await self._arequest(
            "POST",
            "query",
            data,
        )
