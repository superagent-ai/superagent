# Changelog

All notable changes to Superagent will be documented in this file.

## [superagent-ai@0.0.17] - 2025-01-23

### Breaking Changes

- **BREAKING**: Guard endpoint API response schema updated
  - `choices[0].message.content` is now an object (was a JSON string)
  - `choices[0].message.reasoning` replaces `reasoning_content` (deprecated field still supported)
  - Added `model` and `finish_reason` fields to response

### Changed

- Updated SDKs to handle both new and legacy response formats (backward compatible)
- SDK users: No changes required
- Direct API users: Update code to parse `content` as object instead of JSON string

## [superagent-ai@0.0.16 / @superagent-ai/cli@0.0.11] - 2025-01-23

### Added

#### SDKs (Python & TypeScript)
- Added `verify()` method for fact-checking claims against source materials
  - Accepts text and an array of source materials
  - Returns detailed verification results with verdicts, evidence, reasoning, and source references
  - Supports verification against multiple sources with structured output
  - Each claim includes: verdict (true/false), sources used, evidence excerpts, and reasoning

#### CLI
- Added `verify` command for verifying claims from the command line
  - Accepts text and sources via `--sources` flag (JSON format)
  - Supports stdin input for programmatic integration
  - Returns JSON with claim verifications including verdicts and evidence

#### API
- Added `/api/verify` REST endpoint for claim verification
  - POST endpoint accepting text and sources in request body
  - Uses structured output with JSON schema validation
  - Powered by `superagent-lm-verify-20b` model
  - Returns detailed claim-by-claim verification results

#### MCP Server
- Added `superagent_verify` tool for claim verification
  - Accepts text and sources array for fact-checking
  - Returns structured verification results with verdicts and evidence
  - Supports verification against multiple source materials
  - Provides detailed reasoning and source references for each claim

#### Documentation
- Added verify endpoint to OpenAPI specification
- Updated TypeScript SDK documentation with verify examples
- Updated Python SDK documentation with verify examples
- Updated CLI documentation with verify command usage
- Updated MCP server documentation with verify tool examples
- Added verify.mdx documentation page

#### Tests
- Added comprehensive test coverage for verify method in TypeScript SDK
- Added comprehensive test coverage for verify method in Python SDK
- Tests include happy path, validation, error handling, and edge cases

## [@superagent-ai/mcp@0.0.4] - 2025-01-23

### Added
- Initial release of Model Context Protocol (MCP) server for Superagent
- Added `superagent_guard` tool for security threat analysis
  - Detects prompt injection, jailbreaks, and data exfiltration
  - Returns JSON with rejection status, violation types, CWE codes, and reasoning
- Added `superagent_redact` tool for PII/PHI redaction
  - Removes sensitive data like emails, SSNs, phone numbers, credit cards
  - Supports custom entity types for flexible redaction
  - Returns redacted text with placeholders like `<EMAIL_REDACTED>`
- Integration with official `superagent-ai` TypeScript SDK
- Support for Claude Code and Claude Desktop clients
- Published to npm as `@superagent-ai/mcp`

## [superagent-ai@0.0.15 / @superagent-ai/cli@0.0.10] - 2025-01-22

### Breaking Changes

#### Python SDK & TypeScript SDK

- **BREAKING**: Changed method signatures for `guard()` and `redact()` to accept input as first parameter
  - **Before**: `guard(command: str, *, file=None)` / `redact(text: str, *, file=None)`
  - **After**: `guard(input: str | File)` / `redact(input: str | File)`
  - Input is now **either** text **or** file, never both
  - This provides a cleaner, more intuitive API where you pass the thing you want to analyze/redact

- **Python SDK**:
  ```python
  # Before (v0.0.14)
  with open("doc.pdf", "rb") as f:
      result = await client.guard("Analyze this", file=f)
      result = await client.redact("Redact this", file=f, format="pdf")

  # After (v0.0.15)
  with open("doc.pdf", "rb") as f:
      result = await client.guard(f)  # Pass file directly
      result = await client.redact(f, format="pdf")  # Pass file directly
  ```

- **TypeScript SDK**:
  ```typescript
  // Before (v0.0.14)
  const result = await client.guard("text", {}, { file: pdfBlob });
  const result = await client.redact("text", { file: pdfBlob, format: "pdf" });

  // After (v0.0.15)
  const result = await client.guard(pdfBlob);  // Pass file directly
  const result = await client.redact(pdfBlob, { format: "pdf" });  // Pass file directly
  ```

### Added

#### Python SDK & TypeScript SDK

- Added PDF file support to `guard()` method
  - Guard endpoint now accepts PDF files for security analysis
  - Returns JSON analysis of the PDF content (not a processed PDF)
  - Extracts and analyzes text from PDF for security threats
  - Example: `await client.guard(pdf_file)`

- Improved API design with union types
  - `guard(input: str | File)` - accepts string OR file
  - `redact(input: str | File)` - accepts string OR file
  - Automatic detection of input type (no need to specify which)

#### CLI

- Added `--file` flag to `guard` command for PDF file analysis
  - Analyzes PDF files for security threats
  - Returns JSON analysis (not a processed PDF)
  - Example: `superagent guard --file document.pdf`

### Changed

- URL whitelist option now only applies to text input (not file input)
- All PDF examples updated to use new cleaner API
- Documentation updated with Fumadocs TypeTable components for better type information display

## [@superagent-ai/cli@0.0.9] - 2025-10-17

### Breaking Changes
- **BREAKING**: Changed `redact` command input parameter from `prompt` to `text`
  - This aligns with the API specification and SDK parameter naming
  - When using stdin JSON input, use `"text"` instead of `"prompt"`

### Added
- Added `--file` flag to `redact` command for PDF file redaction
  - Accepts path to a PDF file for redaction
  - When a file is provided, `format="pdf"` is automatically set to return a redacted PDF file
  - The redacted PDF is saved to `redacted-output.pdf` in the current directory
  - Example: `superagent redact --file document.pdf "Analyze this document"`

### Migration Guide
```bash
# Before (v0.0.8)
echo '{"prompt": "My email is john@example.com"}' | superagent redact

# After (v0.0.9)
echo '{"text": "My email is john@example.com"}' | superagent redact

# New file redaction feature
superagent redact --file sensitive-document.pdf "Redact PII from this document"
```

## [superagent-ai@0.0.13] - 2025-10-17

### Breaking Changes
- **BREAKING**: Redact API now uses `text` parameter instead of `prompt` in stdin JSON input
  - This change aligns with the API specification
  - The first positional argument remains the text to redact
  - Only affects JSON input from stdin

### Added
- Added `file` parameter to `redact()` method for PDF file redaction
  - Accepts `File` or `Blob` object in TypeScript SDK, file handle in Python SDK
  - When provided, uses multipart/form-data encoding
- Added `format` parameter to `redact()` method
  - `format: "json"` (default) - Returns JSON with redacted text
  - `format: "pdf"` - Returns a PDF Blob/bytes with redactions applied to the original PDF
  - When `format="pdf"` is used with a PDF file input, the API returns a redacted PDF file
- Added `pdf` field to `RedactResult` - contains PDF Blob (TypeScript) or bytes (Python) when `format="pdf"`
- Added `redacted_pdf` field to `RedactResult` - contains base64-encoded PDF when file is provided with JSON response

### Migration Guide
```typescript
// Before (v0.0.12)
// No file support

// After (v0.0.13)
import { createClient } from 'superagent-ai';
import { writeFileSync } from 'fs';

const client = createClient({ apiKey: 'your-api-key' });

// Option 1: Get redacted PDF file (format="pdf")
const pdfFile = new Blob([pdfBuffer], { type: 'application/pdf' });
const result = await client.redact('Analyze this document', {
  file: pdfFile,
  format: 'pdf',  // Returns PDF Blob
  entities: ['SSN', 'credit card numbers']
});

if (result.pdf) {
  // Save the redacted PDF
  const arrayBuffer = await result.pdf.arrayBuffer();
  writeFileSync('redacted.pdf', Buffer.from(arrayBuffer));
}

// Option 2: Get redacted text as JSON (format="json", default)
const result2 = await client.redact('Analyze this document', {
  file: pdfFile,
  format: 'json',  // Returns JSON with redacted text
  entities: ['SSN', 'credit card numbers']
});
console.log(result2.redacted);  // Redacted text from PDF
```

```python
# Before (v0.0.12)
# No file support

# After (v0.0.13)
from superagent_ai import create_client

client = create_client(api_key="your-api-key")

# Option 1: Get redacted PDF file (format="pdf")
with open("document.pdf", "rb") as f:
    result = await client.redact(
        text="Analyze this document",
        file=f,
        format="pdf",  # Returns PDF bytes
        entities=["SSN", "credit card numbers"]
    )

if result.pdf:
    # Save the redacted PDF
    with open("redacted.pdf", "wb") as output:
        output.write(result.pdf)

# Option 2: Get redacted text as JSON (format="json", default)
with open("document.pdf", "rb") as f:
    result = await client.redact(
        text="Analyze this document",
        file=f,
        format="json",  # Returns JSON with redacted text
        entities=["SSN", "credit card numbers"]
    )
print(result.redacted)  # Redacted text from PDF
```

## [@superagent-ai/cli@0.0.8] - 2025-10-16

### Added
- Added `--entities` flag to `redact` command for custom entity redaction using natural language
  - Accepts comma-separated list of entity types to redact
  - Example: `superagent redact --entities "credit card numbers,SSN" "text"`

## [superagent-ai@0.0.12] - 2025-10-16

### Added
- Added `entities` parameter to `redact()` method in TypeScript and Python SDKs
  - Allows specifying custom PII entities to redact using natural language descriptions
  - Examples: `["credit card numbers", "email addresses", "phone numbers"]`
  - Sent in request body to redaction API for AI-powered interpretation
- Added `RedactOptions` interface to TypeScript SDK for better type safety

### Documentation
- Added "Custom Entity Redaction" section to TypeScript SDK documentation with examples
- Added "Custom Entity Redaction" section to Python SDK documentation with examples
- Updated CLI documentation with `--entities` flag usage and examples

## [@superagent-ai/cli@0.0.7] - 2025-10-07

### Added
- Added `redact` command for removing sensitive data from text
- Added `--url-whitelist` option to `redact` command for preserving specific URLs
- Added `--help` flag to all commands for better developer experience

### Changed
- Updated `guard` command to use `createClient()` instead of deprecated `createGuard()`
- Removed `--mode` flag from `guard` command (use separate `redact` command instead)
- Improved help text and command-line interface

### Migration Guide
```bash
# Before (v0.0.6)
superagent guard --mode redact "My email is john@example.com"
superagent guard --mode full "prompt"

# After (v0.0.7)
superagent redact "My email is john@example.com"
superagent guard "prompt"  # guard no longer supports redaction
```

## [superagent-ai@0.0.11] - 2025-10-07

### Added
- Added `urlWhitelist` option to `redact()` method for preserving specific URLs during redaction

### Deprecated
- `createGuard()` is deprecated in favor of `createClient()`

## [@superagent-ai/cli@0.0.6] - 2025-10-06

### Breaking Changes
- **BREAKING**: Replaced `--redacted` flag with `--mode` flag
  - `--redacted` → `--mode full`
  - New: `--mode analyze` (default) for analysis only
  - New: `--mode redact` for redaction only (no API call)

### Enhancements
- Added `--mode` flag with three options: `analyze`, `redact`, `full`
- `--mode redact` allows PII/PHI redaction without API calls
- `--mode analyze` (default) performs guard analysis only
- `--mode full` combines guard analysis with redaction

### Migration Guide
```bash
# Before (v0.0.5)
superagent guard --redacted "prompt"

# After (v0.0.6)
superagent guard --mode full "prompt"
```

## [superagent-ai@0.0.9] - 2025-10-06

### Breaking Changes
- **BREAKING**: Replaced `redacted` boolean option with `mode` parameter in both TypeScript and Python SDKs
  - `redacted: false` → `mode: "analyze"` (default)
  - `redacted: true` → `mode: "full"`
  - New: `mode: "redact"` for redaction-only operation (no API call)

### Enhancements
- Added `mode` parameter with three operation modes: `"analyze"`, `"redact"`, and `"full"`
- `"redact"` mode allows PII/PHI redaction without making API calls to guard endpoint
- `"analyze"` mode (default) performs guard analysis without redaction (backward compatible behavior)
- `"full"` mode combines guard analysis with redaction (replaces `redacted: true`)

### Migration Guide
```typescript
// Before (v0.0.7)
createGuard({ redacted: false })  // or omit redacted
createGuard({ redacted: true })

// After (v0.0.8)
createGuard({ mode: "analyze" })  // or omit mode (default)
createGuard({ mode: "full" })
```

## [@superagent-ai/cli@0.0.5] - 2025-10-01

### Enhancements
- Added `--redacted` flag to enable redaction of sensitive data (PII/PHI) in prompts
- Updated output format to JSON matching SDK response structure
- Upgraded `superagent-ai` dependency to v0.0.7


## [superagent-ai@0.0.7] - 2025-10-01

### Enhancements
- Added `redacted` option to `createGuard()` for automatic PII/PHI redaction
- Added `redacted` field to `GuardResult` response containing sanitized prompt
- Added comprehensive redaction patterns for SOC2, HIPAA, and GDPR compliance (emails, SSNs, credit cards, phone numbers, API keys, IP addresses, etc.)

