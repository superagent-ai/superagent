# Superagent TypeScript SDK

A lightweight client for calling the Superagent Guard, Redact, and Verify endpoints from TypeScript or JavaScript projects.

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

// Guard: Analyze PDF from URL
const urlGuardResult = await client.guard("https://example.com/document.pdf", {
  onBlock: (reason) => console.warn("Guard blocked:", reason),
  onPass: () => console.log("Guard approved!"),
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

// Verify: Check claims against source materials
const verifyResult = await client.verify(
  "The company was founded in 2020 and has 500 employees",
  [
    {
      name: "About Us",
      content: "Founded in 2020, our company has grown rapidly...",
      url: "https://example.com/about"
    },
    {
      name: "Team Page",
      content: "We currently have over 450 team members...",
      url: "https://example.com/team"
    }
  ]
);

console.log(verifyResult.claims);
// Output: Array of claim verifications with verdicts, evidence, and reasoning
```

## API Reference

### `createClient(options)`

Creates a new Superagent client.

**Options:**
- `apiKey` (required) – API key provisioned in Superagent
- `apiBaseUrl` (optional) – Base URL for the API (defaults to `https://app.superagent.sh/api`)
- `fetch` (optional) – Custom fetch implementation (defaults to global `fetch`)
- `timeoutMs` (optional) – Request timeout in milliseconds

### `client.guard(input, callbacks?)`

Analyzes text, a PDF file, or a PDF URL for security threats.

**Parameters:**
- `input` – The text to analyze, a File/Blob object (e.g., PDF), or a URL string (e.g., `"https://example.com/document.pdf"`)
- `callbacks` (optional) – Object with `onPass` and `onBlock` callbacks

**Note:** URLs are automatically detected if the string starts with `http://` or `https://`. The API will download and analyze the PDF from the URL.

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
- `options` (optional) – Redaction options

**Returns:** `Promise<RedactResult>`

```ts
interface RedactOptions {
  urlWhitelist?: string[];  // URL prefixes to preserve
  entities?: string[];      // Custom entity types to redact (natural language)
  file?: File | Blob;       // File to redact (e.g., PDF document)
  format?: "PDF";           // Format of the file
}

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

## Custom Entity Redaction

You can specify custom PII entities to redact using natural language:

```ts
const result = await client.redact(
  "My credit card is 4532-1234-5678-9010 and employee ID is EMP-12345",
  { entities: ["credit card numbers", "employee IDs"] }
);
// Output: "My credit card is <REDACTED> and employee ID is <REDACTED>"
```

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

## PDF File Redaction

You can redact sensitive information from PDF files:

```ts
import { readFileSync } from 'fs';

const client = createClient({
  apiKey: process.env.SUPERAGENT_API_KEY!,
});

// Read PDF file
const pdfBuffer = readFileSync('sensitive-document.pdf');
const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });

// Redact the PDF
const result = await client.redact(
  "Analyze and redact PII from this document",
  {
    file: pdfBlob,
    format: "PDF",
    entities: ["SSN", "credit card numbers", "email addresses"]
  }
);

console.log(result.redacted);  // Redacted text content from the PDF
console.log(result.reasoning); // Explanation of what was redacted
```

**Note:** File redaction uses multipart/form-data encoding and currently supports PDF format only.

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
