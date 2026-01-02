<p align="center">
  <img src="logo.png" width="80" alt="Superagent" />
</p>

<h1 align="center">Superagent</h1>

<p align="center">
  <strong>Make your AI safe. And prove it.</strong>
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

Superagent protects your AI applications against prompt injections, data leaks, and harmful outputs. Embed safety directly into your app and prove compliance to your customers.

## Safety Agent

The Safety Agent integrates with your AI to stop attacks and protect sensitive data in real-time.

### Guard

Block prompt injections, jailbreaks, and data exfiltration before they reach your models.

```typescript
import { createClient } from "@superagent-ai/safety-agent";

const client = createClient();

const result = await client.guard({
  input: userMessage
});

if (result.classification === "block") {
  console.log("Blocked:", result.violation_types);
}
```

### Redact

Remove PII, PHI, and secrets from text in real-time. Enable privacy and compliance without manual review.

```typescript
const result = await client.redact({
  input: "My email is john@example.com and SSN is 123-45-6789",
  model: "openai/gpt-4o-mini"
});

console.log(result.redacted);
// "My email is <EMAIL_REDACTED> and SSN is <SSN_REDACTED>"
```

## Safety Tests

Adversarial tests that probe your AI for prompt injection weaknesses, data leakage paths, and failure modes. Find vulnerabilities before attackers do and get evidence for compliance.

[Learn more →](https://superagent.sh/product/safety-tests)

## Safety Page

A shareable page that shows your guardrails and test results. Close enterprise deals without scrambling to answer security questionnaires.

[Learn more →](https://superagent.sh/product/safety-page)

## Get Started

Sign up at [superagent.sh](https://superagent.sh) to get your API key.

```bash
npm install @superagent-ai/safety-agent
```

```bash
export SUPERAGENT_API_KEY=your-key
```

## Integration Options

| Option | Description | Link |
|--------|-------------|------|
| **TypeScript SDK** | Embed guard and redact directly in your app | [sdk/typescript](sdk/typescript/README.md) |
| **CLI** | Command-line tool for testing and automation | [cli](cli/README.md) |
| **MCP Server** | Use with Claude Code and Claude Desktop | [mcp](mcp/README.md) |
| **REST API** | Direct HTTP integration | [docs.superagent.sh](https://docs.superagent.sh) |

## Why Superagent?

- **Low latency** — Optimized for runtime use without compromising performance
- **Any LLM** — Works with OpenAI, Anthropic, Google, Groq, Bedrock, and more
- **Open source** — MIT license with full transparency
- **Compliance-ready** — Maps to EU AI Act, SOC 2, HIPAA, and GDPR requirements
- **Production-proven** — Trusted by Y Combinator companies shipping AI at scale

## Resources

- [Documentation](https://docs.superagent.sh)
- [Discord Community](https://discord.gg/spZ7MnqFT4)
- [HuggingFace Models](https://huggingface.co/superagent-ai)
- [Twitter/X](https://x.com/superagent_ai)

## License

MIT
