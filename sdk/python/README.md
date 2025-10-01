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
from superagent_ai import create_guard

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
        print("Approved", result.decision)

    await guard.aclose()

asyncio.run(main())
```

### Options

- `api_base_url` – fully qualified URL for your Guard endpoint.
- `api_key` – API key provisioned in Superagent.
- `timeout` – optional request timeout (defaults to 10 seconds).
- `client` – optionally provide your own configured `httpx.AsyncClient`.
- `redacted` – when `True`, redacts PII/PHI data from commands (defaults to `False`).

The returned `GuardResult` includes both the raw analysis payload from the Guard endpoint and the parsed decision for straightforward policy enforcement.

## PII/PHI Redaction

Enable automatic redaction of sensitive data to comply with SOC2, HIPAA, and GDPR:

```python
guard = create_guard(
    api_base_url="https://example.com/api/guard",
    api_key="sk-...",
    redacted=True,  # Enable PII/PHI redaction
)

result = await guard("My email is john@example.com and SSN is 123-45-6789")

print(result.redacted)
# Output: "My email is <REDACTED_EMAIL> and SSN is <REDACTED_SSN>"
```

### Detected PII/PHI Types

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

### GuardResult Fields

```python
@dataclass
class GuardResult:
    rejected: bool              # True if guard blocked the command
    reasoning: str              # Explanation from the guard
    raw: AnalysisResponse       # Full API response
    decision: Optional[GuardDecision]  # Parsed decision details
    usage: Optional[GuardUsage]        # Token usage stats
    redacted: Optional[str]     # Redacted command (if redacted=True)
```
