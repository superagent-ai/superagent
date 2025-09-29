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

## Quick Start

### SDKs

Install and use Guard to enforce runtime protections directly in your application:

**Python:**
```bash
pip install superagent-ai
```

**TypeScript:**
```bash
npm install superagent-ai
```

See [guard/python/README.md](guard/python/README.md) and [guard/typescript/README.md](guard/typescript/README.md) for usage examples and API documentation.

### Proxy

Run Superagent as a reverse proxy to protect all AI API traffic:

**Node.js:**
```bash
cd node/
npm install
npm start
```

**Rust (High Performance):**
```bash
cd rust/
cargo build --release
./target/release/ai-firewall start
```

**Docker:**
```bash
docker-compose up -d
```

See [node/README.md](node/README.md) and [rust/README.md](rust/README.md) for configuration, CLI options, and programmatic usage.

## Configuration

Edit `superagent.yaml` to configure models and providers:

```yaml
models:
  - model_name: "gpt-4o"
    provider: "openai"
    api_base: "https://api.openai.com"

  - model_name: "claude-3-7-sonnet-20250219"
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
├── node/           # Node.js proxy implementation
├── rust/           # Rust proxy implementation (high performance)
├── guard/
│   ├── python/     # Python Guard SDK
│   └── typescript/ # TypeScript Guard SDK
├── docker/         # Docker configurations
└── README.md       # This file
```

## Documentation

Full documentation available at [docs.superagent.sh](https://docs.superagent.sh)

## License

See [LICENSE](LICENSE) file for details.