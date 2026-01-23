# Superagent Safety Agent

A lightweight TypeScript guardrail SDK for content safety with support for multiple LLM providers.


## Installation

```bash
npm install safety-agent
```

## Prerequisites

1. Sign up for an account at [superagent.sh](https://superagent.sh)
2. Create an API key from your dashboard
3. Set the `SUPERAGENT_API_KEY` environment variable or pass it to `createClient()`

## Quick Start

```typescript
import { createClient } from "safety-agent";

const client = createClient();

// Guard - Classify input as safe or unsafe (uses default Superagent model)
const guardResult = await client.guard({
  input: "user message to analyze"
});

// Or specify a different model explicitly
const guardResultWithModel = await client.guard({
  input: "user message to analyze",
  model: "openai/gpt-4o-mini" 
});

if (guardResult.classification === "block") {
  console.log("Blocked:", guardResult.violation_types);
}

console.log(`Tokens used: ${guardResult.usage.totalTokens}`);

// Redact - Sanitize sensitive content
const redactResult = await client.redact({
  input: "My email is john@example.com and SSN is 123-45-6789",
  model: "openai/gpt-4o-mini"
});

console.log(redactResult.redacted);
// "My email is [REDACTED_EMAIL] and SSN is [REDACTED_SSN]"
console.log(`Tokens used: ${redactResult.usage.totalTokens}`);
```

## Supported Providers

Use the `provider/model` format when specifying models:

| Provider | Model Format | Required Env Variables |
|----------|-------------|----------------------|
| **Superagent** | `superagent/{model}` | None (default for guard) |
| Anthropic | `anthropic/{model}` | `ANTHROPIC_API_KEY` |
| AWS Bedrock | `bedrock/{model}` | `AWS_BEDROCK_API_KEY`<br>`AWS_BEDROCK_REGION` (optional) |
| Fireworks | `fireworks/{model}` | `FIREWORKS_API_KEY` |
| Google | `google/{model}` | `GOOGLE_API_KEY` |
| Groq | `groq/{model}` | `GROQ_API_KEY` |
| OpenAI | `openai/{model}` | `OPENAI_API_KEY` |
| OpenRouter | `openrouter/{provider}/{model}` | `OPENROUTER_API_KEY` |
| Vercel AI Gateway | `vercel/{provider}/{model}` | `AI_GATEWAY_API_KEY` |


Set the appropriate API key environment variable for your chosen provider. The Superagent guard model is used by default for `guard()` and requires no API keys.

## File Support

The `guard()` method supports analyzing various file types in addition to plain text.

### PDF Support

PDFs can be analyzed by providing a URL or Blob. Text is extracted from each page and analyzed in parallel for optimal performance.

```typescript
// Analyze PDF from URL
const result = await client.guard({
  input: "https://example.com/document.pdf",
  model: "openai/gpt-4o-mini"
});

// Analyze PDF from Blob (browser)
const pdfBlob = new Blob([pdfData], { type: 'application/pdf' });
const result = await client.guard({
  input: pdfBlob,
  model: "openai/gpt-4o-mini"
});
```

**Notes:**
- Each page is analyzed in parallel for low latency
- Uses OR logic: blocks if ANY page contains a violation
- Text extraction only (no OCR for scanned PDFs)
- Works with all text-capable models

### Image Support

Images can be analyzed using vision-capable models:
- **URLs** (e.g., `https://example.com/image.png`) - automatically fetched and analyzed
- **Blob/File objects** - processed based on MIME type

#### Supported Providers for Images

| Provider | Vision Models | Notes |
|----------|---------------|-------|
| **OpenAI** | `gpt-4o`, `gpt-4o-mini`, `gpt-4-turbo`, `gpt-4.1` | Full image support |
| **Anthropic** | `claude-3-*`, `claude-sonnet-4-*`, `claude-opus-4-*`, `claude-haiku-4-*` | Full image support |
| **Google** | `gemini-*` | Full image support |

Other providers (Fireworks, Groq, OpenRouter, Vercel, Bedrock) currently support text-only analysis.

#### Supported Image Formats

- PNG (`image/png`)
- JPEG (`image/jpeg`, `image/jpg`)
- GIF (`image/gif`)
- WebP (`image/webp`)

See the [Image Input Examples](#example-image-input) section below for usage examples.

## API Reference

### `createClient(config)`

Creates a new safety agent client.

```typescript
const client = createClient({
  apiKey: "your-api-key"
});
```

#### Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `apiKey` | `string` | No | `SUPERAGENT_API_KEY` env var | API key for Superagent usage tracking |

---

### `client.guard(options)`

Classifies input content as `pass` or `block`.

Supports multiple input types:
- **Plain text**: Analyzed directly
- **URLs** (starting with `http://` or `https://`): Automatically fetched and analyzed
- **Blob/File**: Analyzed based on MIME type (images use vision models)
- **URL objects**: Fetched and analyzed

Automatically chunks large text inputs and processes them in parallel for low latency. Uses OR logic: blocks if ANY chunk contains a violation.

**Default Model**: If no `model` is specified, uses `superagent/guard-0.6b` (no API keys required).

#### Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `input` | `string \| Blob \| URL` | Yes | - | The input to analyze (text, URL, or Blob) |
| `model` | `string` | No | `superagent/guard-0.6b` | Model in `provider/model` format (e.g., `openai/gpt-4o-mini`) |
| `systemPrompt` | `string` | No | - | Custom system prompt that replaces the default guard prompt |
| `chunkSize` | `number` | No | `8000` | Characters per chunk. Set to `0` to disable chunking |
| `hooks` | `GuardHooks` | No | - | Observability hooks for guard execution (start, segment, result, error) |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `classification` | `"pass" \| "block"` | Whether the content passed or should be blocked |
| `violation_types` | `string[]` | Types of violations detected |
| `cwe_codes` | `string[]` | CWE codes associated with violations |
| `usage` | `TokenUsage` | Token usage information |

#### Example

```typescript
const result = await client.guard({
  input: "user message to analyze",
  model: "openai/gpt-4o-mini",
  systemPrompt: `You are a safety classifier. Block any requests for medical advice.
  
  Respond with JSON: { "classification": "pass" | "block", "violation_types": [], "cwe_codes": [] }`
});

if (result.classification === "block") {
  console.log("Blocked:", result.violation_types);
}
```

#### Example (Chunking)

For large inputs, the guard method automatically splits content into chunks and processes them in parallel:

```typescript
// Auto-chunking (default: 8000 chars)
const result = await client.guard({
  input: veryLongDocument,
  model: "openai/gpt-4o-mini"
});

// Custom chunk size
const result = await client.guard({
  input: veryLongDocument,
  model: "openai/gpt-4o-mini",
  chunkSize: 4000 // Smaller chunks
});

// Disable chunking
const result = await client.guard({
  input: shortText,
  model: "openai/gpt-4o-mini",
  chunkSize: 0
});
```

#### Example (Observability Hooks)

```typescript
const result = await client.guard({
  input: "user message to analyze",
  model: "openai/gpt-4o-mini",
  hooks: {
    onStart: (event) => console.log("Guard start:", event),
    onSegment: (event) => console.log("Segment result:", event),
    onResult: (event) => console.log("Guard result:", event),
    onError: (event) => console.warn("Guard error:", event),
  },
});
```

#### Example (URL Input)

Analyze content from a URL - the content is automatically fetched and processed:

```typescript
// Analyze text from a URL
const result = await client.guard({
  input: "https://example.com/document.txt",
  model: "openai/gpt-4o-mini"
});

// Analyze JSON from an API
const result = await client.guard({
  input: "https://api.example.com/data.json",
  model: "openai/gpt-4o-mini"
});

// Using a URL object
const url = new URL("https://example.com/content");
const result = await client.guard({
  input: url,
  model: "openai/gpt-4o-mini"
});
```

#### Example (Image Input) {#example-image-input}

Analyze images using vision-capable models. See [Image Support](#image-support) for supported providers and models.

```typescript
// Analyze image from URL (auto-detected by image extension or content-type)
const result = await client.guard({
  input: "https://example.com/image.png",
  model: "openai/gpt-4o"  // Must be a vision-capable model
});

// Analyze image from Blob (browser)
const imageBlob = new Blob([imageData], { type: 'image/png' });
const result = await client.guard({
  input: imageBlob,
  model: "anthropic/claude-3-5-sonnet-20241022"
});

// Analyze uploaded file (browser)
const file = document.getElementById('upload').files[0];
const result = await client.guard({
  input: file,
  model: "google/gemini-1.5-pro"
});
```

**Note:** Image analysis requires a vision-capable model from a supported provider (OpenAI, Anthropic, or Google). The SDK automatically detects image inputs and routes them to vision-capable models.

---

### `client.redact(options)`

Redacts sensitive or dangerous content from text.

#### Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `input` | `string` | Yes | - | The input text to redact |
| `model` | `string` | Yes | - | Model in `provider/model` format (e.g., `openai/gpt-4o-mini`) |
| `entities` | `string[]` | No | Default PII entities | List of entity types to redact (e.g., `["emails", "phone numbers"]`) |
| `rewrite` | `boolean` | No | `false` | When `true`, rewrites text contextually instead of using placeholders |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `redacted` | `string` | The sanitized text with redactions applied |
| `findings` | `string[]` | Descriptions of what was redacted |
| `usage` | `TokenUsage` | Token usage information |

#### Example (Placeholder Mode - Default)

```typescript
const result = await client.redact({
  input: "My email is john@example.com and SSN is 123-45-6789",
  model: "openai/gpt-4o-mini"
});

console.log(result.redacted);
// "My email is <EMAIL_REDACTED> and SSN is <SSN_REDACTED>"
```

#### Example (Rewrite Mode)

```typescript
const result = await client.redact({
  input: "My email is john@example.com and SSN is 123-45-6789",
  model: "openai/gpt-4o-mini",
  rewrite: true
});

console.log(result.redacted);
// "My email is on file and my social security number has been provided"
```

#### Example (Custom Entities)

```typescript
const result = await client.redact({
  input: "Contact john@example.com or call 555-123-4567",
  model: "openai/gpt-4o-mini",
  entities: ["email addresses"] // Only redact emails, keep phone numbers
});

console.log(result.redacted);
// "Contact <EMAIL_REDACTED> or call 555-123-4567"
```

---

### Token Usage

Both `guard()` and `redact()` methods return token usage information in the `usage` field:

| Field | Type | Description |
|-------|------|-------------|
| `promptTokens` | `number` | Number of tokens in the prompt/input |
| `completionTokens` | `number` | Number of tokens in the completion/output |
| `totalTokens` | `number` | Total tokens used (promptTokens + completionTokens) |

#### Example

```typescript
const result = await client.guard({
  input: "user message to analyze",
  model: "openai/gpt-4o-mini"
});

console.log(`Used ${result.usage.totalTokens} tokens`);
console.log(`Prompt: ${result.usage.promptTokens}, Completion: ${result.usage.completionTokens}`);
```

## Custom System Prompts

Override default prompts for custom classification behavior:

```typescript
const result = await client.guard({
  input: "user message",
  model: "openai/gpt-4o-mini",
  systemPrompt: `Your custom classification prompt here...
  
  Respond with JSON: { "classification": "pass" | "block", "violation_types": [], "cwe_codes": [] }`
});
```

