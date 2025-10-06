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
- `mode` – operation mode: `"analyze"` (default), `"redact"`, or `"full"`.

The guard response includes both the raw analysis payload and the parsed decision, enabling you to plug into custom workflows or audit logs.

## Operation Modes

### Analyze Mode (Default)

Performs guard security analysis via API without redaction:

```ts
import { createGuard } from "superagent-ai";

const guard = createGuard({
  apiBaseUrl: process.env.SUPERAGENT_GUARD_URL!,
  apiKey: process.env.SUPERAGENT_API_KEY!,
  mode: "analyze", // Default mode
});

const result = await guard("Write a hello world script");
// Returns: { rejected: false, decision: {...}, usage: {...} }
```

### Redact Mode

Redacts sensitive PII/PHI data only, without making an API call:

```ts
import { createGuard } from "superagent-ai";

const guard = createGuard({
  apiBaseUrl: process.env.SUPERAGENT_GUARD_URL!,
  apiKey: process.env.SUPERAGENT_API_KEY!,
  mode: "redact", // No API call, redaction only
});

const result = await guard("My email is john@example.com and SSN is 123-45-6789");

console.log(result.redacted);
// Output: "My email is <REDACTED_EMAIL> and SSN is <REDACTED_SSN>"
```

### Full Mode

Performs guard analysis AND includes redacted text in the result:

```ts
import { createGuard } from "superagent-ai";

const guard = createGuard({
  apiBaseUrl: process.env.SUPERAGENT_GUARD_URL!,
  apiKey: process.env.SUPERAGENT_API_KEY!,
  mode: "full", // Both analysis and redaction
});

const result = await guard("My email is john@example.com");
// Returns: { rejected: false, decision: {...}, redacted: "My email is <REDACTED_EMAIL>" }
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
