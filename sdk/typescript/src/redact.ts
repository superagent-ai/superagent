/**
 * Redaction utility for sensitive data patterns (SOC2, HIPAA, GDPR compliance)
 * Uses comprehensive regex patterns to detect and redact PII/PHI
 */

interface RedactionPattern {
  pattern: RegExp;
  replacement: string;
}

const REDACTION_PATTERNS: RedactionPattern[] = [
  // Email addresses
  {
    pattern: /\b[a-z0-9._%+\-—|]+@[a-z0-9.\-—|]+\.[a-z|]{2,6}\b/gi,
    replacement: "<REDACTED_EMAIL>",
  },

  // API keys and tokens (common patterns: sk_, pk_, api_, key_, token_)
  // Must come before other patterns to avoid conflicts
  {
    pattern: /\b(sk|pk|api|token|key)_[A-Za-z0-9_\-]{20,}\b/gi,
    replacement: "<REDACTED_API_KEY>",
  },

  // Bearer tokens
  {
    pattern: /Bearer\s+[A-Za-z0-9_\-\.]{20,}/gi,
    replacement: "Bearer <REDACTED_TOKEN>",
  },

  // AWS Access Keys
  {
    pattern: /\b(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}\b/g,
    replacement: "<REDACTED_AWS_KEY>",
  },

  // Social Security Numbers (comprehensive pattern)
  {
    pattern: /\b(?!000|666|9\d{2})([0-8]\d{2}|7([0-6]\d))[-\s]?(?!00)\d\d[-\s]?(?!0000)\d{4}\b/g,
    replacement: "<REDACTED_SSN>",
  },

  // Credit Cards - Visa
  {
    pattern: /\b[4]\d{3}[\s\-.]?\d{4}[\s\-.]?\d{4}[\s\-.]?\d{4}\b/g,
    replacement: "<REDACTED_CC>",
  },

  // Credit Cards - MasterCard
  {
    pattern: /\b(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)\d{12}\b/g,
    replacement: "<REDACTED_CC>",
  },

  // Credit Cards - American Express
  {
    pattern: /\b3[47]\d{13}\b/g,
    replacement: "<REDACTED_CC>",
  },

  // Phone numbers - US format (with parentheses, dashes, dots, spaces)
  {
    pattern: /\b(\+?1[\-\.\s]?)?\(?\d{3}\)?[\-\.\s]?\d{3}[\-\.\s]?\d{4}\b/g,
    replacement: "<REDACTED_PHONE>",
  },

  // IPv4 addresses
  {
    pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
    replacement: "<REDACTED_IP>",
  },

  // IPv6 addresses
  {
    pattern: /\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b/g,
    replacement: "<REDACTED_IP>",
  },

  // MAC addresses
  {
    pattern: /\b(?:[0-9A-Fa-f]{2}[:\-]){5}[0-9A-Fa-f]{2}\b/g,
    replacement: "<REDACTED_MAC>",
  },

  // Medical record numbers (MRN)
  {
    pattern: /\bMRN[:\s]*\d{6,10}\b/gi,
    replacement: "<REDACTED_MRN>",
  },

  // Passport numbers (alphanumeric, 6-9 characters)
  {
    pattern: /\b[A-Z]{1,2}\d{6,9}\b/g,
    replacement: "<REDACTED_PASSPORT>",
  },

  // IBAN (International Bank Account Number)
  {
    pattern: /\b[A-Z]{2}\d{2}[A-Z0-9]{11,30}\b/g,
    replacement: "<REDACTED_IBAN>",
  },

  // US ZIP codes
  {
    pattern: /\b\d{5}(?:-\d{4})?\b/g,
    replacement: "<REDACTED_ZIP>",
  },
];

/**
 * Redacts sensitive information from a string based on SOC2, HIPAA, and GDPR patterns
 * @param text The text to redact
 * @param urlWhitelist Optional array of whitelisted URLs that should not be redacted
 * @returns The redacted text with sensitive data replaced
 */
export function redactSensitiveData(text: string, urlWhitelist?: string[]): string {
  let redacted = text;

  for (const { pattern, replacement } of REDACTION_PATTERNS) {
    redacted = redacted.replace(pattern, replacement);
  }

  // Redact URLs that are not in the whitelist
  if (urlWhitelist !== undefined) {
    const urlPattern = /https?:\/\/[^\s]+/gi;
    redacted = redacted.replace(urlPattern, (url) => {
      // Check if URL is in whitelist (case-insensitive comparison)
      const isWhitelisted = urlWhitelist.some(
        (whitelistedUrl) => url.toLowerCase().startsWith(whitelistedUrl.toLowerCase())
      );
      return isWhitelisted ? url : "<REDACTED_URL>";
    });
  }

  return redacted;
}
