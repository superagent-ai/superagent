# VibeKit Proxy

Config-driven HTTP proxy for AI APIs with built-in request logging and data redaction.

## Quick Start

### Node.js

```bash
cd node/
npm install
npm start
```

### Docker

```bash
docker build -f docker/Dockerfile.node -t vibekit-proxy .
docker run -p 8080:8080 -v ./config.yaml:/app/config.yaml vibekit-proxy
```

## Configuration

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