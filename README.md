# Superagent

The runtime firewall for AI, blocks LLM vulnerabilities in real time.

## Quick Start

<details>
<summary><strong>Node.js</strong></summary>

Global installation:
```bash
npm i -g ai-firewall
ai-firewall start
```

Or run locally:
```bash
cd node/
npm install
npm start

# With custom config file
npm start -- --config=/path/to/vibekit.yaml
```
</details>

<details>
<summary><strong>Rust (High Performance)</strong></summary>

Global installation:
```bash
cargo install ai-firewall
ai-firewall start
```

Or build locally:
```bash
cd rust/
cargo build --release
./target/release/ai-firewall start

# With custom config file
./target/release/ai-firewall start --config=/path/to/vibekit.yaml

# With redaction API for input screening
./target/release/ai-firewall start --redaction-api-url=http://localhost:3000/redact
```
</details>

<details>
<summary><strong>Docker</strong></summary>

**Single Container:**
```bash
# Node.js proxy
docker build -f docker/Dockerfile.node -t ai-firewall .
docker run -p 8080:8080 -v ./vibekit.yaml:/app/vibekit.yaml ai-firewall

# Redaction API
docker build -f docker/Dockerfile.api -t ai-firewall-redaction-api .
docker run -p 3000:3000 ai-firewall-redaction-api
```

**Full Stack with Docker Compose:**
```bash
# Start all services (proxy + redaction API)
docker-compose -f docker/docker-compose.yml up -d

# Start specific services
docker-compose -f docker/docker-compose.yml up -d redaction-api
docker-compose -f docker/docker-compose.yml up -d ai-firewall-node

# View logs
docker-compose -f docker/docker-compose.yml logs -f redaction-api
```
</details>

## Configuration

<details>
<summary><strong>Config File Location</strong></summary>

By default, both implementations look for `vibekit.yaml` in the current working directory. You can specify a custom config file path using the `--config` parameter:

```bash
# Node.js
npm start -- --config=/etc/vibekit/vibekit.yaml

# Rust
./target/release/ai-firewall start --config=/etc/vibekit/vibekit.yaml
```
</details>

<details>
<summary><strong>Config File Format</strong></summary>

Edit `vibekit.yaml` to add models and API endpoints:

```yaml
models:
  - model_name: "gpt-4o"
    provider: "openai"
    api_base: "https://api.openai.com"
  
  - model_name: "claude-3-7-sonnet-20250219"
    provider: "anthropic"
    api_base: "https://api.anthropic.com/v1"
```
</details>

## CLI Options

<details>
<summary><strong>Command Examples</strong></summary>

Both Node.js and Rust implementations support the following CLI options:

```bash
# Basic usage
ai-firewall start --port 8080

# With custom config
ai-firewall start --port 8080 --config=/path/to/vibekit.yaml

# With redaction API for input screening
ai-firewall start --redaction-api-url=http://localhost:3000/redact

# Background mode (daemon)
ai-firewall start --daemon

# Server management
ai-firewall stop --port 8080
ai-firewall status --port 8080
```
</details>

<details>
<summary><strong>Global Options</strong></summary>

- `-p, --port <PORT>`: Port to run on (default: 8080)
- `-c, --config <PATH>`: Path to vibekit.yaml file (default: vibekit.yaml)
- `--redaction-api-url <URL>`: URL for redaction API to screen user messages
- `-d, --daemon`: Run in background (start command only)
</details>

## Programmatic Usage

<details>
<summary><strong>Node.js Package</strong></summary>

Install the package:
```bash
npm install ai-firewall
```

Create a server programmatically:
```javascript
import ProxyServer from 'ai-firewall';

const port = 8080;
const configPath = './vibekit.yaml'; // optional, defaults to 'vibekit.yaml'
const redactionApiUrl = 'http://localhost:3000/redact'; // optional
const proxy = new ProxyServer(port, configPath, redactionApiUrl);

// Start the server
await proxy.start();

// Graceful shutdown
process.on('SIGINT', () => {
  proxy.stop();
  process.exit(0);
});
```
</details>

<details>
<summary><strong>Rust Crate</strong></summary>

Add to your `Cargo.toml`:
```toml
[dependencies]
ai-firewall = "0.0.1"
```

Create a server programmatically:
```rust
use ai_firewall::ProxyServer;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let port = 8080;
    let config_path = Some("./vibekit.yaml".to_string()); // optional
    let redaction_api_url = Some("http://localhost:3000/redact".to_string()); // optional
    
    let server = ProxyServer::new(port, config_path, redaction_api_url).await?;
    
    // Start the server (this blocks)
    server.start().await?;
    
    Ok(())
}
```
</details>

## Usage

Point your AI client to the proxy URL instead of the direct API:

```bash
curl -X POST http://localhost:8080/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-key" \
  -d '{"model":"claude-3-7-sonnet-20250219","messages":[...]}'
```

Health check: `GET /health`

## Input Redaction

<details>
<summary><strong>Overview</strong></summary>

Superagent Proxy supports optional pre-request redaction by calling an external redaction API to screen user messages before forwarding them to AI providers.
</details>

<details>
<summary><strong>Setup</strong></summary>

Configure the redaction API URL using either:

**Command Line:**
```bash
# Rust
./target/release/ai-firewall start --redaction-api-url=http://localhost:3000/redact

# Node.js (via environment variable)
VIBEKIT_REDACTION_API_URL=http://localhost:3000/redact node src/index.js
```

**Environment Variable:**
```bash
export VIBEKIT_REDACTION_API_URL=http://localhost:3000/redact
ai-firewall start
```
</details>

<details>
<summary><strong>Built-in Redaction Server</strong></summary>

Superagent includes a built-in redaction server powered by a fine-tuned Gemma 3 270M model:

```bash
# Start the redaction server
cd api/
./start.sh

# Start Superagent with redaction enabled
./target/release/ai-firewall start --redaction-api-url=http://localhost:3000/redact
```

The redaction server:
- Uses a fine-tuned Gemma 3 270M GGUF model for efficient inference
- Automatically downloads the model on first run
- Replaces sensitive data with `[REDACTED]`, prompt injections with `[INJECTION]`, and backdoors with `[BACKDOOR]`
- Runs on port 3000 by default
</details>

<details>
<summary><strong>Custom Redaction API Interface</strong></summary>

You can also implement your own redaction API that accepts POST requests with this format:

**Request:**
```json
{
  "prompt": "user's message content"
}
```

**Response:**
```json
{
  "redacted_prompt": "redacted version of the content"
}
```
</details>

<details>
<summary><strong>Behavior</strong></summary>

- **Only user messages** with `role: "user"` are sent for redaction
- **All content types** are supported: simple strings and complex content blocks
- **Graceful fallback**: If redaction fails, the original content is used
- **No impact**: When no redaction URL is provided, requests are processed normally
</details>

## Logging Configuration

<details>
<summary><strong>Structured Logging</strong></summary>

Superagent outputs structured JSON logs to stdout that can be ingested by any log aggregation system (ELK, Splunk, DataDog, Loki, etc.).

**Environment Variables:**
```bash
LOG_LEVEL=info    # debug|info|warn|error (default: info)
```

**Example log output:**
```json
{
  "timestamp": "2024-08-26T10:30:00.000Z",
  "level": "info",
  "message": "Request processed",
  "service": "ai-firewall-node",
  "version": "0.0.1",
  "event_type": "request_processed",
  "trace_id": "abc123-def456-789",
  "request": {
    "method": "POST",
    "url": "/v1/messages",
    "model": "claude-3-5-sonnet",
    "headers": {
      "user-agent": "curl/7.68.0",
      "originator": "my-app"
    },
    "body_size_bytes": 1024
  },
  "response": {
    "status": 200,
    "duration_ms": 1250,
    "body_size_bytes": 2048,
    "is_sse": true
  },
  "redaction": {
    "input_redacted": true,
    "output_redacted": true,
    "processing_time_ms": 15
  },
  "proxy": {
    "target_url": "https://api.anthropic.com/v1/messages",
    "model_routing": true
  }
}
```
</details>

<details>
<summary><strong>Log Integration Examples</strong></summary>

**Docker/Kubernetes (stdout):**
```bash
# View logs directly
docker logs container-name | jq '.'
kubectl logs deployment/ai-firewall | jq '.'

# Pipe to analysis tools
docker logs container-name | grep '"level":"error"'
```

**Fluent Bit:**
```conf
[INPUT]
    Name tail
    Path /var/log/containers/ai-firewall*.log
    Parser json

[OUTPUT] 
    Name elasticsearch
    Match *
    Host elasticsearch.example.com
```

**Vector:**
```toml
[sources.ai_firewall]
  type = "docker_logs"
  include_labels = ["ai-firewall"]

[sinks.datadog]
  type = "datadog_logs"
  inputs = ["ai_firewall"]
  default_api_key = "${DATADOG_API_KEY}"
```

**Promtail (Loki):**
```yaml
scrape_configs:
- job_name: ai-firewall
  docker_sd_configs:
    - host: unix:///var/run/docker.sock
  relabel_configs:
    - source_labels: [__meta_docker_container_label_service]
      target_label: service
```
</details>

## Features

- **Config-based routing** - Route requests to different AI providers
- **Structured logging** - JSON logs compatible with any aggregation system
- **Request/response monitoring** - Complete audit trail of all AI interactions
- **Output data redaction** - Filter sensitive information from AI responses  
- **Input redaction** - Screen user messages with built-in AI redaction server
- **SSE streaming support** - Real-time streaming responses
- **Health monitoring** - Built-in health checks and status endpoints

## Repository Structure

```
├── node/           # Node.js implementation
├── rust/           # Rust implementation (high performance)
├── api/            # Built-in redaction server (Python/FastAPI)
├── docker/         # Docker configurations
└── README.md       # This file
```