# Superagent Guard Python SDK

Python client for sending commands to the Superagent Guard endpoint.

## Installation

```bash
pip install superagent-ai
```

## Local development with uv

From the repository root, install the package (including test extras) and create a managed virtual environment:

```bash
cd guard/python
uv sync --extra tests
```

This will provision `.venv`, install the SDK in editable mode, and pull in the testing dependencies. Once synced, run the test suite with:

```bash
uv run pytest tests
```

## Quick start

```python
import asyncio
from superagent_guard import create_guard

async def main() -> None:
    guard = create_guard(
        api_base_url="https://example.com/api/guard",
        api_key="sk-...",
    )

    result = await guard(
        "Generate a friendly greeting",
        on_block=lambda reason: print("Guard blocked:", reason),
        on_pass=lambda: print("Guard passed"),
    )

    if result.rejected:
        print("Rejected with:", result.reasoning)
    else:
        print("Approved", result.data.classification)

    await guard.aclose()

asyncio.run(main())
```

### Options

- `api_base_url` – fully qualified URL for your Guard endpoint.
- `api_key` – API key provisioned in Superagent.
- `timeout` – optional request timeout (defaults to 10 seconds).
- `client` – optionally provide your own configured `httpx.AsyncClient`.

The returned `GuardResult` includes both the raw analysis payload from the Guard endpoint and the parsed classification for straightforward policy enforcement.
