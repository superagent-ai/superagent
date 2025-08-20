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

# Background mode (daemon)
vibekit-proxy start --daemon

# Server management
vibekit-proxy stop --port 8080
vibekit-proxy status --port 8080
```

### Global Options
- `-p, --port <PORT>`: Port to run on (default: 8080)
- `-c, --config <PATH>`: Path to vibekit.yaml file (default: vibekit.yaml)
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
const proxy = new ProxyServer(port, configPath);

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
    
    let server = ProxyServer::new(port, config_path).await?;
    
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


## Features

- Config-based routing
- Request/response logging
- Data redaction
- SSE streaming support
- Health monitoring