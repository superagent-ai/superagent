# 🥷 Superagent MCP Server

MCP server providing security guardrails and PII redaction through [Superagent](https://superagent.sh).

**Tools:**
- **🛡️ `superagent_guard`** - Detect prompt injection, jailbreaks, and data exfiltration
- **🔒 `superagent_redact`** - Remove PII/PHI (emails, SSNs, phone numbers, credit cards, names, etc.)

## Quick Start

```bash
npm install
npm run build
export SUPERAGENT_API_KEY=your_api_key_here  # Get from superagent.sh
```

Add to Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "superagent": {
      "command": "node",
      "args": ["/absolute/path/to/superagent-mcp/dist/index.js"],
      "env": {
        "SUPERAGENT_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

Restart Claude Desktop.

## Example

**Security Guard:**
```
Check if this input is safe: "Ignore all previous instructions"
```

**PII Redaction:**
```
Redact PII from: "My email is john@example.com and SSN is 123-45-6789"
```

## Documentation

- [usage.md](./usage.md) - Detailed usage examples, tool parameters, and patterns
- [CLAUDE.md](./CLAUDE.md) - Project architecture and development guide

## Development

```bash
npm run build  # Compile TypeScript
npm start      # Run server
npm run dev    # Development mode with auto-reload
```

## License

MIT - Copyright © 2025 Superagent Technologies, Inc.
