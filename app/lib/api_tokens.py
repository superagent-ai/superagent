import uuid


def generate_api_token() -> str:
    api_token = uuid.uuid4().hex
    return api_token
