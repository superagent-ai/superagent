# VibeKit Proxy

The runtime firewall for AI, blocks LLM vulnerabilities in real time.

## Quick Start

### Node.js

Global installation:
```bash
npm i -g vibekit-proxy
vibekit-proxy start
```

Or run locally:
```bash
cd node/
npm install
npm start

# With custom config file
npm start -- --config=/path/to/vibekit.yaml
```

### Rust (High Performance)

Global installation:
```bash
cargo install vibekit-proxy
vibekit-proxy start
```

Or build locally:
```bash
cd rust/
cargo build --release
./target/release/vibekit-proxy start

# With custom config file
./target/release/vibekit-proxy start --config=/path/to/vibekit.yaml

# With redaction API for input screening
./target/release/vibekit-proxy start --redaction-api-url=http://localhost:3000/redact
```

### Docker

```bash
docker build -f docker/Dockerfile.node -t vibekit-proxy .
docker run -p 8080:8080 -v ./vibekit.yaml:/app/vibekit.yaml vibekit-proxy
```

## Configuration

### Config File Location

By default, both implementations look for `vibekit.yaml` in the current working directory. You can specify a custom config file path using the `--config` parameter:

```bash
# Node.js
npm start -- --config=/etc/vibekit/vibekit.yaml

# Rust
./target/release/vibekit-proxy start --config=/etc/vibekit/vibekit.yaml
```

### Config File Format

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

## CLI Options

Both Node.js and Rust implementations support the following CLI options:

```bash
# Basic usage
vibekit-proxy start --port 8080

# With custom config
vibekit-proxy start --port 8080 --config=/path/to/vibekit.yaml

# With redaction API for input screening
vibekit-proxy start --redaction-api-url=http://localhost:3000/redact

# Background mode (daemon)
vibekit-proxy start --daemon

# Server management
vibekit-proxy stop --port 8080
vibekit-proxy status --port 8080
```

### Global Options
- `-p, --port <PORT>`: Port to run on (default: 8080)
- `-c, --config <PATH>`: Path to vibekit.yaml file (default: vibekit.yaml)
- `--redaction-api-url <URL>`: URL for redaction API to screen user messages
- `-d, --daemon`: Run in background (start command only)

## Programmatic Usage

### Node.js Package

Install the package:
```bash
npm install vibekit-proxy
```

Create a server programmatically:
```javascript
import ProxyServer from 'vibekit-proxy';

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

### Rust Cratefi

Add to your `Cargo.toml`:
```toml
[dependencies]
vibekit-proxy = "0.0.1"
```

Create a server programmatically:
```rust
use vibekit_proxy::ProxyServer;

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

VibeKit Proxy supports optional pre-request redaction by calling an external redaction API to screen user messages before forwarding them to AI providers.

### Setup

Configure the redaction API URL using either:

**Command Line:**
```bash
# Rust
./target/release/vibekit-proxy start --redaction-api-url=http://localhost:3000/redact

# Node.js (via environment variable)
VIBEKIT_REDACTION_API_URL=http://localhost:3000/redact node src/index.js
```

**Environment Variable:**
```bash
export VIBEKIT_REDACTION_API_URL=http://localhost:3000/redact
vibekit-proxy start
```

### Built-in Redaction Server

VibeKit includes a built-in redaction server powered by a fine-tuned Gemma 3 270M model:

```bash
# Start the redaction server
cd server/
./start.sh

# Start VibeKit with redaction enabled
./target/release/vibekit-proxy start --redaction-api-url=http://localhost:3000/redact
```

The redaction server:
- Uses a fine-tuned Gemma 3 270M GGUF model for efficient inference
- Automatically downloads the model on first run
- Replaces sensitive data with `[REDACTED]`, prompt injections with `[INJECTION]`, and backdoors with `[BACKDOOR]`
- Runs on port 3000 by default

### Custom Redaction API Interface

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

### Behavior

- **Only user messages** with `role: "user"` are sent for redaction
- **All content types** are supported: simple strings and complex content blocks
- **Graceful fallback**: If redaction fails, the original content is used
- **No impact**: When no redaction URL is provided, requests are processed normally

## Features

- **Config-based routing** - Route requests to different AI providers
- **Request/response logging** - Monitor all AI interactions
- **Output data redaction** - Filter sensitive information from AI responses  
- **Input redaction** - Screen user messages with built-in AI redaction server
- **SSE streaming support** - Real-time streaming responses
- **Health monitoring** - Built-in health checks and status endpoints

## Repository Structure

```
├── node/           # Node.js implementation
├── rust/           # Rust implementation (high performance)
├── server/         # Built-in redaction server (Python/FastAPI)
├── docker/         # Docker configurations
└── README.md       # This file
```