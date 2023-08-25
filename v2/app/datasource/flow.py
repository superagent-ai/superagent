from prefect import task, flow


@task
def hello_task(datasource: dict):
    print(f"Datasource id: {datasource.get('id')}")


@flow(name="finetune", description="Finetune LLM with documents for agent", retries=0)
def finetune_model(datasource: dict):
    hello_task(datasource)
