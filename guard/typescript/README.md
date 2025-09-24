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

The guard response includes both the raw analysis payload and the parsed classification, enabling you to plug into custom workflows or audit logs.
