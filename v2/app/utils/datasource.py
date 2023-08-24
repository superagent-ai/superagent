from prefect import flow

VALID_INGESTION_TYPES = [
    "TXT",
    "PDF",
    "YOUTUBE",
    "MARKDOWN",
    "GITHUB_REPOSITORY",
    "WEBPAGE",
    "NOTION",
]


@flow(name="finetune", log_prints=True, retries=0)
def finetune(datasource: dict) -> None:
    print("Hello workd")
