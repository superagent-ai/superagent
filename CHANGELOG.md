# Changelog

All notable changes to Superagent will be documented in this file.

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

