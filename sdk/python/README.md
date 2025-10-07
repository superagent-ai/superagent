# Superagent Python SDK

Python client for calling the Superagent Guard and Redact endpoints.

## Installation

```bash
pip install superagent-ai
```

## Local development with uv

From the repository root, install the package (including test extras) and create a managed virtual environment:

```bash
cd sdk/python
uv sync --extra tests
```

This will provision `.venv`, install the SDK in editable mode, and pull in the testing dependencies. Once synced, run the test suite with:

```bash
uv run pytest tests
```

## Usage

```python
import asyncio
from superagent_ai import create_client

async def main() -> None:
    client = create_client(
        api_base_url="https://app.superagent.sh/api",  # Optional, this is the default
        api_key="sk-...",
    )

    # Guard: Analyze commands for security threats
    guard_result = await client.guard(
        "Write a hello world script",
        on_block=lambda reason: print("Guard blocked:", reason),
        on_pass=lambda: print("Guard approved!"),
    )

    if guard_result.rejected:
        print("Rejected:", guard_result.reasoning)
    else:
        print("Approved:", guard_result.decision)

    # Redact: Remove sensitive data from text
    redact_result = await client.redact(
        "My email is john@example.com and SSN is 123-45-6789"
    )

    print(redact_result.redacted)
    # Output: "My email is <REDACTED_EMAIL> and SSN is <REDACTED_SSN>"

    await client.aclose()

asyncio.run(main())
```

### Using as a context manager

```python
import asyncio
from superagent_ai import create_client

async def main() -> None:
    async with create_client(api_key="sk-...") as client:
        result = await client.guard("command")
        redacted = await client.redact("text")

asyncio.run(main())
```

## API Reference

### `create_client(**kwargs)`

Creates a new Superagent client.

**Parameters:**
- `api_key` (required) – API key provisioned in Superagent
- `api_base_url` (optional) – Base URL for the API (defaults to `https://app.superagent.sh/api`)
- `client` (optional) – Custom `httpx.AsyncClient` instance
- `timeout` (optional) – Request timeout in seconds (defaults to 10.0)

**Returns:** `Client`

### `client.guard(command, *, on_block=None, on_pass=None)`

Analyzes a command for security threats.

**Parameters:**
- `command` – The text to analyze
- `on_block` (optional) – Callback function called when command is blocked
- `on_pass` (optional) – Callback function called when command is approved

**Returns:** `GuardResult`

```python
@dataclass
class GuardResult:
    rejected: bool              # True if guard blocked the command
    reasoning: str              # Explanation from the guard
    raw: AnalysisResponse       # Full API response
    decision: Optional[GuardDecision]  # Parsed decision details
    usage: Optional[GuardUsage]        # Token usage statistics

@dataclass
class GuardDecision:
    status: Literal["pass", "block"]
    violation_types: list[str]
    cwe_codes: list[str]
```

### `client.redact(text, *, url_whitelist=None)`

Redacts sensitive data from text.

**Parameters:**
- `text` – The text to redact
- `url_whitelist` (optional) – List of URL prefixes that should not be redacted

**Returns:** `RedactResult`

```python
@dataclass
class RedactResult:
    redacted: str               # Text with sensitive data redacted
    reasoning: str              # Explanation of what was redacted
    raw: dict                   # Full API response
    usage: Optional[GuardUsage] # Token usage statistics
```

## Detected PII/PHI Types

The redaction feature detects and replaces:

- **Email addresses** → `<REDACTED_EMAIL>`
- **Social Security Numbers** → `<REDACTED_SSN>`
- **Credit cards** (Visa, Mastercard, Amex) → `<REDACTED_CC>`
- **Phone numbers** (US format) → `<REDACTED_PHONE>`
- **IP addresses** (IPv4/IPv6) → `<REDACTED_IP>`
- **API keys & tokens** → `<REDACTED_API_KEY>`
- **AWS access keys** → `<REDACTED_AWS_KEY>`
- **Bearer tokens** → `Bearer <REDACTED_TOKEN>`
- **MAC addresses** → `<REDACTED_MAC>`
- **Medical record numbers** → `<REDACTED_MRN>`
- **Passport numbers** → `<REDACTED_PASSPORT>`
- **IBAN** → `<REDACTED_IBAN>`
- **ZIP codes** → `<REDACTED_ZIP>`

## URL Whitelisting

You can specify URLs that should not be redacted by passing the `url_whitelist` parameter:

```python
client = create_client(api_key="sk-...")

result = await client.redact(
    "Check out https://github.com/user/repo and https://secret.com/data",
    url_whitelist=["https://github.com", "https://example.com"]
)
# Output: "Check out https://github.com/user/repo and <URL_REDACTED>"
```

The whitelist is applied locally after redaction - URLs matching the prefixes are preserved, while non-whitelisted URLs are replaced with `<URL_REDACTED>`.

## Error Handling

```python
from superagent_ai import GuardError

try:
    result = await client.guard("command")
except GuardError as error:
    print(f"Guard error: {error}")
```
