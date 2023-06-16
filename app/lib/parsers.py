import re
from typing import Any, Iterator, List, Mapping, Optional, Union

from langchain.agents import AgentOutputParser
from langchain.docstore.document import Document
from langchain.document_loaders.base import BaseBlobParser
from langchain.document_loaders.blob_loaders import Blob
from langchain.document_loaders.pdf import BasePDFLoader
from langchain.schema import AgentAction, AgentFinish


class CustomOutputParser(AgentOutputParser):
    def parse(self, llm_output: str) -> Union[AgentAction, AgentFinish]:
        if "Final Answer:" in llm_output:
            return AgentFinish(
                return_values={"output": llm_output.split("Final Answer:")[-1].strip()},
                log=llm_output,
            )
        regex = r"Action\s*\d*\s*:(.*?)\nAction\s*\d*\s*Input\s*\d*\s*:[\s]*(.*)"
        match = re.search(regex, llm_output, re.DOTALL)
        if not match:
            raise ValueError(f"Could not parse LLM output: `{llm_output}`")

        action = match.group(1).strip()
        action_input = match.group(2)

        return AgentAction(
            tool=action, tool_input=action_input.strip(" ").strip('"'), log=llm_output
        )


class CustomPDFPlumberLoader(BasePDFLoader):
    """Loader that uses pdfplumber to load PDF files."""

    def __init__(
        self,
        file_path: str,
        from_page: int = 1,
        to_page: Optional[int] = None,
        text_kwargs: Optional[Mapping[str, Any]] = None,
    ) -> None:
        """Initialize with file path."""
        try:
            import pdfplumber  # noqa:F401
        except ImportError:
            raise ImportError(
                "pdfplumber package not found, please install it with "
                "`pip install pdfplumber`"
            )

        super().__init__(file_path)
        self.text_kwargs = text_kwargs or {}
        self.from_page = from_page
        self.to_page = to_page or None

    def load(self) -> List[Document]:
        """Load file."""

        parser = CustomPDFPlumberParser(
            text_kwargs=self.text_kwargs, from_page=self.from_page, to_page=self.to_page
        )
        blob = Blob.from_path(self.file_path)
        return parser.parse(blob)


class CustomPDFPlumberParser(BaseBlobParser):
    """
    Custom PDF Parser which takes in account the min page number to process
    """

    def __init__(
        self,
        text_kwargs: Optional[Mapping[str, Any]] = None,
        from_page: int = 1,
        to_page: Optional[int] = None,
    ) -> None:
        """Initialize the parser.

        Args:
            text_kwargs: Keyword arguments to pass to ``pdfplumber.Page.extract_text()``
        """
        self.text_kwargs = text_kwargs or {}
        self.from_page = from_page
        self.to_page = to_page

    def lazy_parse(self, blob: Blob) -> Iterator[Document]:
        """Lazily parse the blob."""
        import pdfplumber

        with blob.as_bytes_io() as file_path:
            if self.to_page is None:
                # by default, starts from 1 and processes the whole document
                doc = pdfplumber.open(file_path)
            else:
                if self.to_page > 0:
                    """Parse till the maximum page number provided"""
                    doc = pdfplumber.open(
                        file_path, pages=list(range(self.from_page, self.to_page))
                    )
                else:
                    raise ValueError(
                        "Value of to_page should be greater than equal to 1."
                    )

            yield from [
                Document(
                    page_content=page.extract_text(**self.text_kwargs),
                    metadata=dict(
                        {
                            "source": blob.source,
                            "file_path": blob.source,
                            "page": page.page_number,
                            "total_pages": len(doc.pages),
                        },
                        **{
                            k: doc.metadata[k]
                            for k in doc.metadata
                            if type(doc.metadata[k]) in [str, int]
                        },
                    ),
                )
                for page in doc.pages
            ]
