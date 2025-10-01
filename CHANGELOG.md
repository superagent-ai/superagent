# Changelog

All notable changes to Superagent will be documented in this file.

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

