# Superagent Python SDK

Python client for calling the Superagent Guard, Redact, and Verify endpoints.

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

    # Guard: Analyze PDF from URL
    url_guard_result = await client.guard(
        "https://example.com/document.pdf",
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

    # Verify: Check claims against source materials
    verify_result = await client.verify(
        "The company was founded in 2020 and has 500 employees",
        [
            {
                "name": "About Us",
                "content": "Founded in 2020, our company has grown rapidly...",
                "url": "https://example.com/about"
            },
            {
                "name": "Team Page",
                "content": "We currently have over 450 team members...",
                "url": "https://example.com/team"
            }
        ]
    )

    print(verify_result.claims)
    # Output: Array of claim verifications with verdicts, evidence, and reasoning

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

### `client.guard(input, *, on_block=None, on_pass=None, system_prompt=None)`

Analyzes text, a PDF file, or a PDF URL for security threats.

**Parameters:**
- `input` – The text to analyze, a file object (e.g., PDF opened in binary mode), or a URL string (e.g., `"https://example.com/document.pdf"`)
- `on_block` (optional) – Callback function called when input is blocked
- `on_pass` (optional) – Callback function called when input is approved
- `system_prompt` (optional) – System prompt that allows you to steer the guard REST API behavior and customize the classification logic

**Note:** URLs are automatically detected if the string starts with `http://` or `https://`. The API will download and analyze the PDF from the URL.

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

### `client.redact(text, *, url_whitelist=None, entities=None, format=None, rewrite=None)`

Redacts sensitive data from text.

**Parameters:**
- `text` – The text to redact
- `url_whitelist` (optional) – List of URL prefixes that should not be redacted
- `entities` (optional) – List of custom entity types to redact (natural language descriptions)
- `format` (optional) – Output format: "json" (default) or "pdf" (for file input)
- `rewrite` (optional) – When True, naturally rewrite content to remove sensitive information instead of using placeholders

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

## Custom Entity Redaction

You can specify custom PII entities to redact using natural language:

```python
client = create_client(api_key="sk-...")

result = await client.redact(
    "My credit card is 4532-1234-5678-9010 and employee ID is EMP-12345",
    entities=["credit card numbers", "employee IDs"]
)
# Output: "My credit card is <REDACTED> and employee ID is <REDACTED>"
```

## Natural Rewrite Mode

By default, sensitive information is replaced with placeholders like `<EMAIL_REDACTED>`. When `rewrite=True` is set, the API will naturally rewrite content to remove sensitive information while maintaining readability:

```python
client = create_client(api_key="sk-...")

result = await client.redact(
    "Contact me at john@example.com or call (555) 123-4567",
    rewrite=True
)
# Output: "Contact me via email or call by phone"
```

This is useful when you want the output to read naturally without obvious redaction markers.

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

## PDF File Redaction

You can redact sensitive information from PDF files:

```python
import asyncio
from superagent_ai import create_client

async def main() -> None:
    async with create_client(api_key="sk-...") as client:
        # Read and redact PDF file
        with open("sensitive-document.pdf", "rb") as pdf_file:
            result = await client.redact(
                text="Analyze and redact PII from this document",
                file=pdf_file,
                format="PDF",
                entities=["SSN", "credit card numbers", "email addresses"]
            )

            print(result.redacted)  # Redacted text content from the PDF
            print(result.reasoning) # Explanation of what was redacted

asyncio.run(main())
```

**Note:** File redaction uses multipart/form-data encoding and currently supports PDF format only.

## Error Handling

```python
from superagent_ai import GuardError

try:
    result = await client.guard("command")
except GuardError as error:
    print(f"Guard error: {error}")
```
