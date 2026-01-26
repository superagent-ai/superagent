<p align="center">
  <img src="logo.png" width="80" alt="Superagent" />
</p>

<h1 align="center">Superagent SDK</h1>

<p align="center">
  <strong>Make your AI apps safe.</strong>
</p>

<p align="center">
  <a href="https://superagent.sh">Website</a> ·
  <a href="https://docs.superagent.sh">Docs</a> ·
  <a href="https://discord.gg/spZ7MnqFT4">Discord</a> ·
  <a href="https://huggingface.co/superagent-ai">HuggingFace</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Y%20Combinator-Backed-orange" alt="Y Combinator" />
  <img src="https://img.shields.io/github/stars/superagent-ai/superagent?style=social" alt="GitHub stars" />
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License" />
</p>

---

An open-source SDK for AI agent safety. Block prompt injections, redact PII and secrets, scan repositories for threats, and run red team scenarios against your agent.

## Features

### Guard

Detect and block prompt injections, malicious instructions, and unsafe tool calls at runtime.

**TypeScript:**

```typescript
import { createClient } from "safety-agent";

const client = createClient();

const result = await client.guard({
  input: userMessage
});

if (result.classification === "block") {
  console.log("Blocked:", result.violation_types);
}
```

**Python:**

```python
from safety_agent import create_client

client = create_client()

result = await client.guard(input=user_message)

if result.classification == "block":
    print("Blocked:", result.violation_types)
```

### Redact

Remove PII, PHI, and secrets from text automatically.

**TypeScript:**

```typescript
const result = await client.redact({
  input: "My email is john@example.com and SSN is 123-45-6789",
  model: "openai/gpt-4o-mini"
});

console.log(result.redacted);
// "My email is <EMAIL_REDACTED> and SSN is <SSN_REDACTED>"
```

**Python:**

```python
result = await client.redact(
    input="My email is john@example.com and SSN is 123-45-6789",
    model="openai/gpt-4o-mini"
)

print(result.redacted)
# "My email is <EMAIL_REDACTED> and SSN is <SSN_REDACTED>"
```

### Scan

Analyze repositories for AI agent-targeted attacks such as repo poisoning and malicious instructions.

**TypeScript:**

```typescript
const result = await client.scan({
  repo: "https://github.com/user/repo"
});

console.log(result.result);  // Security report
console.log(`Cost: $${result.usage.cost.toFixed(4)}`);
```

**Python:**

```python
result = await client.scan(repo="https://github.com/user/repo")

print(result.result)  # Security report
print(f"Cost: ${result.usage.cost:.4f}")
```

### Test

Run red team scenarios against your production agent. *(Coming soon)*

```typescript
const result = await client.test({
  endpoint: "https://your-agent.com/chat",
  scenarios: ["prompt_injection", "data_exfiltration"]
});

console.log(result.findings);  // Vulnerabilities discovered
```

## Get Started

Sign up at [superagent.sh](https://superagent.sh) to get your API key.

**TypeScript:**

```bash
npm install safety-agent
```

**Python:**

```bash
uv add safety-agent
```

**Set your API key:**

```bash
export SUPERAGENT_API_KEY=your-key
```

## Integration Options

| Option | Description | Link |
|--------|-------------|------|
| **TypeScript SDK** | Embed guard, redact, and scan directly in your app | [sdk/typescript](sdk/typescript/README.md) |
| **Python SDK** | Embed guard, redact, and scan directly in Python apps | [sdk/python](sdk/python/README.md) |
| **CLI** | Command-line tool for testing and automation | [cli](cli/README.md) |
| **MCP Server** | Use with Claude Code and Claude Desktop | [mcp](mcp/README.md) |

## Why Superagent SDK?

- **Works with any model** — OpenAI, Anthropic, Google, Groq, Bedrock, and more
- **Open-weight models** — Run Guard on your infrastructure with 50-100ms latency
- **Low latency** — Optimized for runtime use
- **Open source** — MIT license with full transparency

## Open-Weight Models

Run Guard on your own infrastructure. No API calls, no data leaving your environment.

| Model | Parameters | Use Case |
|-------|------------|----------|
| [superagent-guard-0.6b](https://huggingface.co/superagent-ai/superagent-guard-0.6b) | 0.6B | Fast inference, edge deployment |
| [superagent-guard-1.7b](https://huggingface.co/superagent-ai/superagent-guard-1.7b) | 1.7B | Balanced speed and accuracy |
| [superagent-guard-4b](https://huggingface.co/superagent-ai/superagent-guard-4b) | 4B | Maximum accuracy |

GGUF versions for CPU: [0.6b-gguf](https://huggingface.co/superagent-ai/superagent-guard-0.6b-gguf) · [1.7b-gguf](https://huggingface.co/superagent-ai/superagent-guard-1.7b-gguf) · [4b-gguf](https://huggingface.co/superagent-ai/superagent-guard-4b-gguf)

## Resources

- [Documentation](https://docs.superagent.sh)
- [Discord Community](https://discord.gg/spZ7MnqFT4)
- [HuggingFace Models](https://huggingface.co/superagent-ai)
- [Twitter/X](https://x.com/superagent_ai)

## License

MIT
