# Superagent

Runtime protection for AI applications - blocks prompt injection, backdoor attacks, and sensitive data leaks in real time.

## Features

🛡️ **Prompt Injection Protection** - Detects and blocks malicious prompt injections before they reach your AI models

🔒 **Backdoor Attack Prevention** - Identifies hidden backdoor commands and neutralizes them automatically  

🚫 **Sensitive Data Filtering** - Prevents PII, secrets, and confidential information from being exposed in AI responses

⚡ **Real-time Processing** - Zero-latency protection with streaming response support

📊 **Complete Observability** - Structured JSON logs for monitoring, alerting, and compliance

🔄 **Model Routing** - Route requests to different AI providers based on model configuration

## Quick Start

```bash
# Node.js
cd node/ && npm install && npm start

# Rust (high performance)
cd rust/ && cargo build --release && ./target/release/ai-firewall start

# Docker
docker-compose up -d
```

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

# Optional: Send telemetry data to external webhook
telemetry_webhook:
  url: "https://your-webhook-endpoint.com/api/telemetry"
  headers:
    x-api-key: "your-api-key"
    x-team-id: "your-team-id"
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

## AI Firewall Protection

<details>
<summary><strong>Built-in Firewall Engine</strong></summary>

Powered by a fine-tuned Gemma 3 270M model for real-time threat detection:

```bash
# Start the firewall engine
cd api/ && ./start.sh

# Start proxy with firewall enabled  
./target/release/ai-firewall start --redaction-api-url=http://localhost:3000/redact
```

**Protection Types:**
- 🛡️ **Prompt Injections** → Replaced with `[INJECTION]`
- 🔒 **Backdoor Commands** → Replaced with `[BACKDOOR]`  
- 🚫 **Sensitive Data (PII)** → Replaced with `[REDACTED]`

**Features:**
- Automatic model download on first run
- Sub-100ms inference time
- Supports all message formats (text, structured content)
- Graceful fallback if firewall is unavailable
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
    "model": "claude-3-7-sonnet-20250219",
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

## Additional Features

- **Zero-trust Security** - Every request is analyzed and sanitized before processing
- **Complete Audit Trail** - Detailed logs for compliance and security monitoring  
- **Multi-provider Support** - Route between OpenAI, Anthropic, and other AI providers
- **High Performance** - Rust implementation scales from development to production
- **Easy Deployment** - Docker support with health checks and graceful shutdown

## Repository Structure

```
├── node/           # Node.js implementation
├── rust/           # Rust implementation (high performance)
├── api/            # Built-in redaction server (Python/FastAPI)
├── docker/         # Docker configurations
└── README.md       # This file
```
