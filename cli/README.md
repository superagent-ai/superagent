# Superagent CLI

Command-line interface for [Superagent](https://superagent.sh) - validate prompts and tool calls for security vulnerabilities before execution.

## Installation

```bash
npm install -g @superagent-ai/cli
```

## Usage

### Standalone CLI

Check if a prompt is safe:

```bash
superagent guard "Write a hello world script"
```

Output:
```json
{
  "rejected": false,
  "decision": {
    "status": "pass"
  },
  "reasoning": "Command approved by guard."
}
```

Block malicious prompts:

```bash
superagent guard "Delete all files with rm -rf /"
```

Output:
```json
{
  "rejected": true,
  "decision": {
    "status": "block",
    "violation_types": ["unlawful_behavior"],
    "cwe_codes": ["CWE-77"]
  },
  "reasoning": "User wants to delete all files. That is disallowed (exploit). Block."
}
```

### Operation Modes

Use the `--mode` flag to control how the CLI processes prompts:

**Analyze Mode** (default) - Perform security analysis via API:
```bash
superagent guard "Write a script"
superagent guard --mode analyze "Write a script"
```

**Redact Mode** - Only redact sensitive data (no API call):
```bash
superagent guard --mode redact "My email is john@example.com and SSN is 123-45-6789"
```

Output:
```json
{
  "rejected": false,
  "reasoning": "Redaction only mode - no guard analysis performed",
  "redacted": "My email is <REDACTED_EMAIL> and SSN is <REDACTED_SSN>"
}
```

**Full Mode** - Security analysis + redaction:
```bash
superagent guard --mode full "My API key is sk_test_123 in this script"
```

Output includes both `decision` and `redacted` fields.

### Claude Code Hook

Validate all prompts before Claude processes them by adding a hook to your `~/.claude/settings.json`:

```json
{
  "env": {
    "SUPERAGENT_API_KEY": "your_api_key_here"
  },
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "superagent guard"
          }
        ]
      }
    ]
  }
}
```

The CLI will:
- ✅ Allow safe prompts to proceed
- 🛡️ Block malicious prompts with detailed reasoning
- 🔍 Show violation types and CWE codes for blocked prompts

### Environment Variables

- `SUPERAGENT_API_KEY` - Your Superagent API key (required)

Get your API key at [app.superagent.sh](https://app.superagent.sh)

## How It Works

The CLI uses [Superagent](https://superagent.sh) to analyze prompts for:

- **Security vulnerabilities** (SQL injection, command injection, etc.)
- **Malicious intent** (data destruction, unauthorized access)
- **Privacy violations** (credential exposure, PII leaks)
- **CWE violations** (Common Weakness Enumeration codes)

When used as a Claude Code hook, it automatically:
1. Receives the user's prompt via stdin
2. Sends it to Superagent for analysis
3. Returns a structured response to block or allow the prompt
4. Shows detailed violation information when blocking

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Test locally
node dist/index.js guard "test prompt"
```

## License

MIT