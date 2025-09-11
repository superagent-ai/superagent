# Redaction API Server

A FastAPI-based redaction service that uses a fine-tuned Gemma model to redact sensitive information, prompt injections, and backdoors from user messages.

## Setup

### Prerequisites

You need a Hugging Face token to download the model:
1. Create an account at [huggingface.co](https://huggingface.co)
2. Generate an access token from your [HF settings](https://huggingface.co/settings/tokens)
3. Set the token as an environment variable:
   ```bash
   export HF_TOKEN=your_token_here
   ```

### Installation

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

## Docker Usage

To run the API using Docker:

```bash
# Build the Docker image
docker build -f docker/Dockerfile.api -t redaction-api .

# Run the container with your HF_TOKEN
docker run -e HF_TOKEN=your_token_here -p 3000:3000 redaction-api
```

## API Endpoints

### POST /redact
Classifies prompts as jailbreak attempts or benign content.

**Request:**
```json
{
  "prompt": "user message content"
}
```

**Response:**
```json
{
  "label": "benign"
}
```
or
```json
{
  "label": "jailbreak"
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

## Integration with AI Firewall

To use this redaction API with your AI firewall:

```bash
# Rust version
./target/release/ai-firewall start --redaction-api-url=http://localhost:3000/redact

# Node.js version  
NINJA_LM_API_URL=http://localhost:3000/redact node src/index.js
```

## Model

Uses the fine-tuned Gemma model: `superagent-ai/ninja-lm-270m-gguf`

The model classifies prompts as:
- **benign**: Safe content that passes through unchanged
- **jailbreak**: Malicious content that gets replaced with "jailbreak attempt detected, skipping..."

When integrated with the AI firewall:
- Benign prompts are forwarded to the target AI service unchanged
- Jailbreak attempts are replaced with the detection message before forwarding