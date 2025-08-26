# Redaction API Server

A FastAPI-based redaction service that uses a fine-tuned Gemma model to redact sensitive information, prompt injections, and backdoors from user messages.

## Setup

1. **Start the server:**
   ```bash
   ./start.sh
   ```
   This will:
   - Install uv (if not already installed)
   - Create a Python virtual environment with uv
   - Install dependencies using uv
   - Download the Gemma redaction model
   - Start the server on port 3000

2. **Test the API:**
   ```bash
   uv run python test_api.py
   ```

## API Endpoints

### POST /redact
Redacts sensitive content from user prompts.

**Request:**
```json
{
  "prompt": "user message content"
}
```

**Response:**
```json
{
  "redacted_prompt": "processed content with [REDACTED], [INJECTION], [BACKDOOR] replacements"
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "device": "cuda"
}
```

## Integration with AI Proxy

To use this redaction API with your AI proxy:

```bash
# Rust version
./target/release/ai-proxy start --redaction-api-url=http://localhost:3000/redact

# Node.js version  
VIBEKIT_REDACTION_API_URL=http://localhost:3000/redact node src/index.js
```

## Model

Uses the fine-tuned Gemma model: `superagent-ai/redact-lm-gemma-3-270M-gguf`

The model is trained to:
- Replace prompt injections with `[INJECTION]`
- Replace backdoors with `[BACKDOOR]`
- Replace sensitive data with `[REDACTED]`