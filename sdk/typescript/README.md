# Superagent Guard TypeScript SDK

A lightweight client for calling the Superagent Guard endpoint from TypeScript or JavaScript projects.

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
import { createGuard } from "superagent-ai";

const guard = createGuard({
  apiBaseUrl: process.env.SUPERAGENT_GUARD_URL!,
  apiKey: process.env.SUPERAGENT_API_KEY!,
});

const command = "Write a benign hello world script";

const { data, rejected, reasoning } = await guard(command, {
  onBlock: (reason) => {
    console.warn("Guard blocked command:", reason);
  },
  onPass: () => {
    console.log("Guard approved command, continue!");
  },
});

if (rejected) {
  // handle rejection logic
} else {
  // proceed with the approved command
}
```

### Options

- `apiBaseUrl` – fully qualified URL for your Guard endpoint.
- `apiKey` – API key provisioned in Superagent.
- `fetch` – optional custom fetch implementation (defaults to global `fetch`).
- `timeoutMs` – optional timeout for the outbound request.
- `redacted` – when `true`, redacts PII/PHI data from commands (defaults to `false`).

The guard response includes both the raw analysis payload and the parsed decision, enabling you to plug into custom workflows or audit logs.

## PII/PHI Redaction

Enable automatic redaction of sensitive data to comply with SOC2, HIPAA, and GDPR:

```ts
import { createGuard } from "superagent-ai";

const guard = createGuard({
  apiBaseUrl: process.env.SUPERAGENT_GUARD_URL!,
  apiKey: process.env.SUPERAGENT_API_KEY!,
  redacted: true, // Enable PII/PHI redaction
});

const result = await guard("My email is john@example.com and SSN is 123-45-6789");

console.log(result.redacted);
// Output: "My email is <REDACTED_EMAIL> and SSN is <REDACTED_SSN>"
```

### Detected PII/PHI Types

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

### GuardResult Interface

```ts
interface GuardResult {
  rejected: boolean;           // True if guard blocked the command
  decision?: GuardDecision;    // Parsed decision details
  usage?: GuardUsage;          // Token usage statistics
  reasoning: string;           // Explanation from the guard
  raw: AnalysisResponse;       // Full API response
  redacted?: string;           // Redacted command (if redacted=true)
}
```
