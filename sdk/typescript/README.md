# Superagent TypeScript SDK

A lightweight client for calling the Superagent Guard and Redact endpoints from TypeScript or JavaScript projects.

## Installation

```bash
npm install superagent-ai
# or
pnpm add superagent-ai
# or
yarn add superagent-ai
```

## Usage

```ts
import { createClient } from "superagent-ai";

const client = createClient({
  apiBaseUrl: process.env.SUPERAGENT_API_BASE_URL, // Optional, defaults to https://app.superagent.sh/api
  apiKey: process.env.SUPERAGENT_API_KEY!,
});

// Guard: Analyze commands for security threats
const guardResult = await client.guard("Write a hello world script", {
  onBlock: (reason) => {
    console.warn("Guard blocked command:", reason);
  },
  onPass: () => {
    console.log("Guard approved command!");
  },
});

if (guardResult.rejected) {
  console.log("Blocked:", guardResult.reasoning);
} else {
  console.log("Approved");
}

// Redact: Remove sensitive data from text
const redactResult = await client.redact(
  "My email is john@example.com and SSN is 123-45-6789"
);

console.log(redactResult.redacted);
// Output: "My email is <REDACTED_EMAIL> and SSN is <REDACTED_SSN>"
```

## API Reference

### `createClient(options)`

Creates a new Superagent client.

**Options:**
- `apiKey` (required) – API key provisioned in Superagent
- `apiBaseUrl` (optional) – Base URL for the API (defaults to `https://app.superagent.sh/api`)
- `fetch` (optional) – Custom fetch implementation (defaults to global `fetch`)
- `timeoutMs` (optional) – Request timeout in milliseconds

### `client.guard(command, callbacks?)`

Analyzes a command for security threats.

**Parameters:**
- `command` – The text to analyze
- `callbacks` (optional) – Object with `onPass` and `onBlock` callbacks

**Returns:** `Promise<GuardResult>`

```ts
interface GuardResult {
  rejected: boolean;        // True if guard blocked the command
  decision?: GuardDecision; // Parsed decision details
  usage?: GuardUsage;       // Token usage statistics
  reasoning: string;        // Explanation from the guard
  raw: AnalysisResponse;    // Full API response
}

interface GuardDecision {
  status: "pass" | "block";
  violation_types?: string[];
  cwe_codes?: string[];
}
```

### `client.redact(text, options?)`

Redacts sensitive data from text.

**Parameters:**
- `text` – The text to redact
- `options` (optional) – Options object with `urlWhitelist` array of URL prefixes to preserve

**Returns:** `Promise<RedactResult>`

```ts
interface RedactResult {
  redacted: string;      // Text with sensitive data redacted
  reasoning: string;     // Explanation of what was redacted
  usage?: GuardUsage;    // Token usage statistics
  raw: RedactionResponse; // Full API response
}
```

## Detected PII/PHI Types

The redaction feature detects and replaces:

- **Email addresses** → `<REDACTED_EMAIL>`
- **Social Security Numbers** → `<REDACTED_SSN>`
- **Credit cards** (Visa, Mastercard, Amex) → `<REDACTED_CC>`
- **Phone numbers** (US format) → `<REDACTED_PHONE>`
- **IP addresses** (IPv4/IPv6) → `<REDACTED_IP>`
- **API keys & tokens** → `<REDACTED_API_KEY>`
- **AWS access keys** → `<REDACTED_AWS_KEY>`
- **Bearer tokens** → `Bearer <REDACTED_TOKEN>`
- **MAC addresses** → `<REDACTED_MAC>`
- **Medical record numbers** → `<REDACTED_MRN>`
- **Passport numbers** → `<REDACTED_PASSPORT>`
- **IBAN** → `<REDACTED_IBAN>`
- **ZIP codes** → `<REDACTED_ZIP>`

## URL Whitelisting

You can specify URLs that should not be redacted by passing the `urlWhitelist` option:

```ts
const client = createClient({
  apiKey: process.env.SUPERAGENT_API_KEY!,
});

const result = await client.redact(
  "Check out https://github.com/user/repo and https://secret.com/data",
  { urlWhitelist: ["https://github.com", "https://example.com"] }
);
// Output: "Check out https://github.com/user/repo and <URL_REDACTED>"
```

The whitelist is applied locally after redaction - URLs matching the prefixes are preserved, while non-whitelisted URLs are replaced with `<URL_REDACTED>`.

## Error Handling

```ts
import { GuardError } from "superagent-ai";

try {
  const result = await client.guard("command");
} catch (error) {
  if (error instanceof GuardError) {
    console.error("Guard error:", error.message);
  }
}
```
