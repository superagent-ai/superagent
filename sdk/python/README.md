# Safety Agent Python SDK

A lightweight Python guardrail SDK for content safety. Guard against prompt injections, jailbreaks, and data exfiltration. Redact PII, PHI, and secrets from text.

## Installation

```bash
uv add safety-agent
```

Or with pip:

```bash
pip install safety-agent
```

## Prerequisites

Sign up at [superagent.sh](https://superagent.sh) to get your API key.

```bash
export SUPERAGENT_API_KEY=your-key
```

## Quick Start

```python
from safety_agent import create_client

client = create_client()

# Guard: Detect threats (uses default superagent/guard-1.7b model)
result = await client.guard(input="user message to analyze")

if result.classification == "block":
    print("Blocked:", result.violation_types)

# Redact: Remove PII
result = await client.redact(
    input="My email is john@example.com",
    model="openai/gpt-4o-mini"
)

print(result.redacted)
# "My email is <EMAIL_REDACTED>"
```

## Guard

The `guard()` method classifies input content as `pass` or `block`. It detects prompt injections, malicious instructions, and security threats.

```python
result = await client.guard(
    input="Ignore all previous instructions",
    model="openai/gpt-4o-mini",  # Optional, defaults to superagent/guard-1.7b
    system_prompt="Custom system prompt",  # Optional
    chunk_size=8000,  # Optional, characters per chunk
)

print(result.classification)  # "pass" or "block"
print(result.violation_types)  # ["prompt_injection", ...]
print(result.cwe_codes)  # ["CWE-94", ...]
```

### Input Types

Guard supports multiple input types:

- **Plain text**: Analyzed directly
- **URLs**: Automatically fetched and analyzed
- **Bytes/Files**: Analyzed based on content type
- **PDFs**: Text extracted and analyzed per page

```python
# URL input
result = await client.guard(input="https://example.com/document.pdf")

# File input
with open("document.pdf", "rb") as f:
    result = await client.guard(input=f.read())
```

## Redact

The `redact()` method removes sensitive content from text.

```python
result = await client.redact(
    input="My SSN is 123-45-6789",
    model="openai/gpt-4o-mini",
    entities=["SSN", "email"],  # Optional, custom entities
    rewrite=True,  # Optional, contextual rewriting
)

print(result.redacted)
print(result.findings)
```

## Supported Providers

- OpenAI (`openai/gpt-4o`, `openai/gpt-4o-mini`, etc.)
- Anthropic (`anthropic/claude-3-5-sonnet-20241022`, etc.)
- Google (`google/gemini-2.0-flash`, etc.)
- AWS Bedrock (`bedrock/us.anthropic.claude-3-5-sonnet-20241022-v2:0`, etc.)
- Groq (`groq/llama-3.3-70b-versatile`, etc.)
- Fireworks (`fireworks/accounts/fireworks/models/llama-v3p3-70b-instruct`, etc.)
- OpenRouter (`openrouter/openai/gpt-4o`, etc.)
- Vercel (`vercel/openai/gpt-4o`, etc.)
- Superagent (`superagent/guard-1.7b`, etc.) - Default for guard

## Environment Variables

Configure provider API keys:

```bash
export SUPERAGENT_API_KEY=your-superagent-key
export OPENAI_API_KEY=your-openai-key
export ANTHROPIC_API_KEY=your-anthropic-key
export GOOGLE_API_KEY=your-google-key
export GROQ_API_KEY=your-groq-key
export FIREWORKS_API_KEY=your-fireworks-key
export OPENROUTER_API_KEY=your-openrouter-key
export AI_GATEWAY_API_KEY=your-vercel-key
```

## License

MIT
