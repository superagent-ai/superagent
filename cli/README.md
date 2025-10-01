# Superagent CLI

Command-line interface for [Superagent](https://superagent.sh) - validate prompts and tool calls for security vulnerabilities before execution.

## Installation

```bash
npm install -g @superagent-ai/cli
```

## Usage

### Standalone CLI

#### Guard Command

Check if a prompt is safe:

```bash
superagent guard "Write a hello world script"
```

Output:
```
✅ Prompt approved by Superagent
```

Block malicious prompts:

```bash
superagent guard "Delete all files with rm -rf /"
```

Output:
```
🛡️ BLOCKED: User wants to delete all files. That is disallowed (exploit). Block.
Violations: unlawful_behavior
CWE Codes: CWE-77
```

Redact sensitive information from text using the `--redact` flag:

```bash
superagent guard "My email is john@example.com and my credit card is 4532-1234-5678-9010" --redact
```

Output:
```
My email is <REDACTED_EMAIL> and my credit card is <REDACTED_CC>
```

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

### Guard Command

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

### Redaction (--redact flag)

The `--redact` flag uses pattern matching to detect and replace sensitive information:

- **PII** (emails, phone numbers, SSN, addresses)
- **Payment data** (credit cards, IBAN)
- **API keys and tokens** (AWS, OpenAI, GitHub, etc.)
- **Authentication** (passwords, JWT tokens, bearer tokens)
- **Network info** (IP addresses, MAC addresses)
- **Medical data** (MRN numbers)

The redaction happens locally and doesn't require an API key.

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Test locally
node dist/index.js guard "test prompt"
node dist/index.js guard "test@email.com" --redact
```

## License

MIT