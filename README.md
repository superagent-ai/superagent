# Superagent

Runtime protection for AI agents and copilots - inspect prompts, validate tool calls, and block threats in real time.

## What is Superagent?

Superagent is a secure proxy between your apps, models, and tools. It provides:

- **Runtime Protection** - Detects prompt injections, backdoors, and data leaks in real time
- **Guarded Tooling** - Validates tool calls and parameters before execution
- **SuperagentLM** - Reasoning-driven safety model with sub-50ms latency
- **Unified Observability** - Centralized policies, audits, and compliance logs

## Components

This repository contains:

1. **SDKs** (Python & TypeScript) - Validate actions directly in your app without running the proxy
2. **Proxy** (Node.js & Rust) - Route requests through a secure reverse proxy with runtime protection
3. **CLI** - Command-line interface for managing and interacting with Superagent

## Quick Start

### SDKs

Install and use the SDK to enforce runtime protections directly in your application:

**Python:**
```bash
pip install superagent-ai
```

**TypeScript:**
```bash
npm install superagent-ai
```

See [sdk/python/README.md](sdk/python/README.md) and [sdk/typescript/README.md](sdk/typescript/README.md) for usage examples and API documentation.

### CLI

Install the CLI tool for managing Superagent:

```bash
npm install -g @superagent-ai/cli
```

### Proxy

Run Superagent as a reverse proxy to protect all AI API traffic:

**Node.js:**
```bash
cd proxy/node/
npm install
npm start
```

**Rust (High Performance):**
```bash
cd proxy/rust/
cargo build --release
./target/release/ai-firewall start
```

**Docker:**
```bash
docker-compose up -d
```

See [proxy/node/README.md](proxy/node/README.md) and [proxy/rust/README.md](proxy/rust/README.md) for configuration, CLI options, and programmatic usage.

## Configuration

Edit `superagent.yaml` to configure models and providers:

```yaml
models:
  - model_name: "gpt-5"
    provider: "openai"
    api_base: "https://api.openai.com"

  - model_name: "claude-sonnet-4-5"
    provider: "anthropic"
    api_base: "https://api.anthropic.com/v1"

# Optional: Send telemetry to external webhook
telemetry_webhook:
  url: "https://your-webhook.com/api/telemetry"
  headers:
    x-api-key: "your-api-key"
```

## Repository Structure

```
├── proxy/
│   ├── node/       # Node.js proxy implementation
│   └── rust/       # Rust proxy implementation (high performance)
├── sdk/
│   ├── python/     # Python SDK
│   └── typescript/ # TypeScript SDK
├── cli/            # Command-line interface
├── docker/         # Docker configurations
└── README.md       # This file
```

## Documentation

- **Docs**: [docs.superagent.sh](https://docs.superagent.sh)
- **Models**: [huggingface.co/superagent-ai](https://huggingface.co/superagent-ai)

## License

See [LICENSE](LICENSE) file for details.