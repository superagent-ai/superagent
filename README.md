# VibeKit Proxy

The runtime firewall for AI, blocks LLM vulnerabilities in real time.

## Quick Start

### Node.js

```bash
cd node/
npm install
npm start

# With custom config file
npm start -- --config=/path/to/config.yaml
```

### Rust (High Performance)

```bash
cd rust/
cargo build --release
./target/release/vibekit-proxy start

# With custom config file
./target/release/vibekit-proxy start --config=/path/to/config.yaml
```

### Docker

```bash
docker build -f docker/Dockerfile.node -t vibekit-proxy .
docker run -p 8080:8080 -v ./config.yaml:/app/config.yaml vibekit-proxy
```

## Configuration

### Config File Location

By default, both implementations look for `config.yaml` in the current working directory. You can specify a custom config file path using the `--config` parameter:

```bash
# Node.js
npm start -- --config=/etc/vibekit/config.yaml

# Rust
./target/release/vibekit-proxy start --config=/etc/vibekit/config.yaml
```

### Config File Format

Edit `config.yaml` to add models and API endpoints:

```yaml
models:
  - model_name: "gpt-4o"
    provider: "openai"
    api_base: "https://api.openai.com"
  
  - model_name: "claude-3-7-sonnet-20250219"
    provider: "anthropic"
    api_base: "https://api.anthropic.com/v1"
```

## CLI Options

Both Node.js and Rust implementations support the following CLI options:

```bash
# Basic usage
vibekit-proxy start --port 8080

# With custom config
vibekit-proxy start --port 8080 --config=/path/to/config.yaml

# Background mode (daemon)
vibekit-proxy start --daemon

# Server management
vibekit-proxy stop --port 8080
vibekit-proxy status --port 8080
```

### Global Options
- `-p, --port <PORT>`: Port to run on (default: 8080)
- `-c, --config <PATH>`: Path to config.yaml file (default: config.yaml)
- `-d, --daemon`: Run in background (start command only)

## Usage

Point your AI client to the proxy URL instead of the direct API:

```bash
curl -X POST http://localhost:8080/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-key" \
  -d '{"model":"claude-3-7-sonnet-20250219","messages":[...]}'
```

Health check: `GET /health`


## Features

- Config-based routing
- Request/response logging
- Data redaction
- SSE streaming support
- Health monitoring