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