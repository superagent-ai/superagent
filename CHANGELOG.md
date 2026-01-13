# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [typescript/0.1.7] [python/0.1.1] - 2026-01-13

### Security

- **SSRF Protection**: URL security validation to prevent Server-Side Request Forgery attacks
  - Blocks private/internal IP addresses (IPv4 and IPv6)
  - Blocks localhost and loopback addresses (127.0.0.0/8, ::1)
  - Blocks link-local addresses (169.254.0.0/16, fe80::/10)
  - Blocks private ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, fc00::/7)
  - DNS resolution check to prevent hostname-based SSRF bypasses
  - Protocol validation (blocks file://, only allows http/https)
  - URL length validation (max 2048 characters)
  - Fail-safe behavior: DNS resolution failures are treated as private
  - Available in both Python and TypeScript SDKs

## [0.1.6] - 2025-12-22

### Added
- Support for `superagent/guard-1.7b` and `superagent/guard-4b` models

### Changed
- Default guard model changed from `superagent/guard-0.6b` to `superagent/guard-1.7b`

## [0.1.5] - 2025-12-18

### Added

- **Superagent Provider**: New `superagent` provider for Superagent's hosted guard model
- **Default Model**: `guard()` now defaults to `superagent/guard-0.6b` when no model is specified
- Zero-config guard usage - no API keys required for default model

### Changed

- `model` parameter is now optional in `guard()` options
- Superagent model uses built-in prompt (no system message sent)

## [0.1.4] - 2025-12-17

### Changed

- Updated usage tracking endpoint to `https://superagent.sh/api/billing/usage`
- Changed authentication header from `Authorization: Bearer` to `x-api-key`
- Simplified usage payload to `{ token_count: X }`

### Documentation

- Added Prerequisites section to README with account signup instructions

## [0.1.3] - 2025-12-09

### Added

- **PDF Support**: The `guard()` method now supports PDF documents
  - Text extraction from PDFs using `unpdf` library
  - Each page is analyzed in parallel for optimal performance
  - Uses OR logic: blocks if ANY page contains a violation
  - Supports both URL and Blob/File inputs
- **Image Support**: Vision-capable models can now analyze images
  - Supported formats: PNG, JPEG, GIF, WebP
  - Supports OpenAI (gpt-4o, gpt-4o-mini), Anthropic (claude-3-*), and Google (gemini-*) vision models
  - Auto-detection of image URLs and Blob/File inputs
- **URL Input Support**: The `guard()` method accepts URLs directly
  - Automatically fetches and analyzes content from URLs
  - Supports both string URLs and URL objects
  - Content type auto-detection from headers or file extension
- **Blob/File Input Support**: Direct analysis of binary data
  - MIME type detection for proper routing
  - Supports browser File API

### Changed

- Updated `GuardInput` type to support `string | Blob | URL`
- Added `ProcessedInput` type with support for text, image, and PDF types

## [0.1.2] - 2025-12-08

### Added

- **Chunking Support**: Large text inputs are automatically chunked and processed in parallel
  - Default chunk size: 8000 characters
  - Configurable via `chunkSize` option
  - Set `chunkSize: 0` to disable chunking
  - Uses OR logic: blocks if ANY chunk is classified as unsafe

### Changed

- Improved token usage aggregation for chunked requests

## [0.1.0] - 2025-12-07

### Added

- Initial release
- **Guard Method**: Classify input as `pass` or `block`
  - Detects prompt injection attempts
  - Identifies system prompt extraction
  - Returns violation types and CWE codes
- **Redact Method**: Sanitize sensitive content
  - Default PII entity detection (emails, SSN, phone numbers, etc.)
  - Custom entity support via `entities` option
  - Rewrite mode for contextual redaction
- **Multi-Provider Support**:
  - OpenAI
  - Anthropic
  - Google (Gemini)
  - AWS Bedrock
  - Groq
  - Fireworks
  - OpenRouter
  - Vercel AI Gateway
- **Structured Output**: JSON schema enforcement for supported models
- **Custom System Prompts**: Override default classification behavior
- **Token Usage Tracking**: Detailed token usage in responses


