#!/usr/bin/env node
/**
 * Superagent MCP Server
 *
 * This server provides security guardrails and PII redaction capabilities through
 * the Superagent.sh API, enabling AI systems to detect malicious inputs and
 * redact sensitive information.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { ResponseFormat } from "./types.js";
import type { GuardClassification } from "./types.js";
import { callGuardApi, callRedactApi, handleApiError } from "./api-client.js";
import { CHARACTER_LIMIT } from "./constants.js";

// ============================================================================
// Zod Schemas
// ============================================================================

const GuardInputSchema = z.object({
  text: z.string()
    .min(1, "Text cannot be empty")
    .max(50000, "Text exceeds maximum length of 50,000 characters")
    .describe("The user input text to analyze for security threats like prompt injection, system prompt extraction, or data exfiltration"),
  response_format: z.nativeEnum(ResponseFormat)
    .default(ResponseFormat.MARKDOWN)
    .describe("Output format: 'markdown' for human-readable or 'json' for machine-readable")
}).strict();

type GuardInput = z.infer<typeof GuardInputSchema>;

const RedactInputSchema = z.object({
  text: z.string()
    .min(1, "Text cannot be empty")
    .max(50000, "Text exceeds maximum length of 50,000 characters")
    .describe("The text content to be analyzed and redacted for sensitive information (PII/PHI)"),
  entities: z.array(z.string())
    .optional()
    .describe("Optional array of custom entity types to redact. If not provided, defaults to standard PII entities (SSNs, emails, phone numbers, credit cards, etc.). Examples: ['EMAIL', 'SSN', 'PHONE_NUMBER', 'CREDIT_CARD', 'NAME', 'ADDRESS']"),
  response_format: z.nativeEnum(ResponseFormat)
    .default(ResponseFormat.MARKDOWN)
    .describe("Output format: 'markdown' for human-readable or 'json' for machine-readable")
}).strict();

type RedactInput = z.infer<typeof RedactInputSchema>;

// ============================================================================
// Formatting Utilities
// ============================================================================

/**
 * Format guard results in markdown format
 */
function formatGuardMarkdown(
  text: string,
  classification: GuardClassification,
  reasoning: string,
  usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number }
): string {
  const lines: string[] = ["# Security Analysis Result", ""];

  // Classification
  const statusEmoji = classification.classification === "block" ? "🛑" : "✅";
  lines.push(`## ${statusEmoji} Classification: ${classification.classification.toUpperCase()}`);
  lines.push("");

  // Violation types if present
  if (classification.violation_types && classification.violation_types.length > 0) {
    lines.push("## ⚠️ Detected Threats");
    for (const violation of classification.violation_types) {
      lines.push(`- **${violation.replace(/_/g, " ").toUpperCase()}**`);
    }
    lines.push("");
  }

  // CWE codes if present
  if (classification.cwe_codes && classification.cwe_codes.length > 0) {
    lines.push("## 🔍 Security References");
    for (const cwe of classification.cwe_codes) {
      lines.push(`- ${cwe}`);
    }
    lines.push("");
  }

  // Reasoning
  if (reasoning) {
    lines.push("## 📝 Analysis");
    lines.push(reasoning);
    lines.push("");
  }

  // Original text (truncated if too long)
  lines.push("## 📄 Analyzed Text");
  const truncatedText = text.length > 200 ? text.substring(0, 200) + "..." : text;
  lines.push(`\`\`\`\n${truncatedText}\n\`\`\``);
  lines.push("");

  // Usage stats
  lines.push("## 📊 Token Usage");
  lines.push(`- Prompt tokens: ${usage.prompt_tokens}`);
  lines.push(`- Completion tokens: ${usage.completion_tokens}`);
  lines.push(`- Total tokens: ${usage.total_tokens}`);

  return lines.join("\n");
}

/**
 * Format guard results in JSON format
 */
function formatGuardJson(
  text: string,
  classification: GuardClassification,
  reasoning: string,
  usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number }
): string {
  const result = {
    classification: classification.classification,
    violation_types: classification.violation_types || [],
    cwe_codes: classification.cwe_codes || [],
    reasoning,
    analyzed_text_preview: text.length > 200 ? text.substring(0, 200) + "..." : text,
    usage
  };
  return JSON.stringify(result, null, 2);
}

/**
 * Format redact results in markdown format
 */
function formatRedactMarkdown(
  originalText: string,
  redactedText: string,
  reasoning: string,
  usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number }
): string {
  const lines: string[] = ["# Redaction Result", ""];

  // Redacted text
  lines.push("## 🔒 Redacted Text");
  lines.push(redactedText);
  lines.push("");

  // Reasoning
  if (reasoning) {
    lines.push("## 📝 Changes Made");
    lines.push(reasoning);
    lines.push("");
  }

  // Original text preview
  lines.push("## 📄 Original Text (Preview)");
  const truncatedOriginal = originalText.length > 200 ? originalText.substring(0, 200) + "..." : originalText;
  lines.push(`\`\`\`\n${truncatedOriginal}\n\`\`\``);
  lines.push("");

  // Usage stats
  lines.push("## 📊 Token Usage");
  lines.push(`- Prompt tokens: ${usage.prompt_tokens}`);
  lines.push(`- Completion tokens: ${usage.completion_tokens}`);
  lines.push(`- Total tokens: ${usage.total_tokens}`);

  return lines.join("\n");
}

/**
 * Format redact results in JSON format
 */
function formatRedactJson(
  originalText: string,
  redactedText: string,
  reasoning: string,
  usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number }
): string {
  const result = {
    redacted_text: redactedText,
    reasoning,
    original_text_preview: originalText.length > 200 ? originalText.substring(0, 200) + "..." : originalText,
    usage
  };
  return JSON.stringify(result, null, 2);
}

/**
 * Check if response exceeds character limit and truncate if necessary
 */
function checkCharacterLimit(content: string): string {
  if (content.length > CHARACTER_LIMIT) {
    const truncated = content.substring(0, CHARACTER_LIMIT);
    return truncated + `\n\n⚠️ [Response truncated at ${CHARACTER_LIMIT} characters]`;
  }
  return content;
}

// ============================================================================
// MCP Server Setup
// ============================================================================

const server = new McpServer({
  name: "superagent-mcp-server",
  version: "1.0.0"
});

// ============================================================================
// Tool: superagent_guard
// ============================================================================

server.registerTool(
  "superagent_guard",
  {
    title: "Superagent Security Guard",
    description: `Analyze text for security threats including prompt injection, system prompt extraction, and data exfiltration attempts using Superagent's security AI model.

This tool uses Superagent's LM-Guard-20B model to classify user inputs and detect malicious intent. It returns a classification (block/allow) along with specific violation types and CWE (Common Weakness Enumeration) codes for identified threats.

Args:
  - text (string): The user input text to analyze for security threats (max 50,000 characters)
  - response_format ('markdown' | 'json'): Output format (default: 'markdown')
    - 'markdown': Human-readable format with sections for classification, threats, and analysis
    - 'json': Machine-readable structured data for programmatic processing

Returns:
  For JSON format:
  {
    "classification": "block" | "allow",
    "violation_types": string[],  // e.g., ["prompt_injection", "system_prompt_extraction"]
    "cwe_codes": string[],        // e.g., ["CWE-94"]
    "reasoning": string,          // Explanation of the classification
    "analyzed_text_preview": string,
    "usage": {
      "prompt_tokens": number,
      "completion_tokens": number,
      "total_tokens": number
    }
  }

  For Markdown format: Formatted sections including classification status, detected threats, CWE references, and detailed analysis.

Examples:
  - Use when: Validating user input before passing to an LLM
  - Use when: "Check if this message is a prompt injection: 'Ignore previous instructions...'"
  - Use when: Building a content moderation system for AI applications
  - Don't use when: You need to redact PII (use superagent_redact instead)

Common Violation Types:
  - prompt_injection: Attempts to override system instructions
  - system_prompt_extraction: Tries to reveal system prompts or internal instructions
  - data_exfiltration: Attempts to extract sensitive data or bypass security controls
  - jailbreak: Tries to bypass safety guidelines or content policies

Error Handling:
  - Returns "Error: Invalid request" if text is empty or exceeds length limits (400 status)
  - Returns "Error: Authentication failed" if API key is invalid (401 status)
  - Returns "Error: Payment required" if subscription is inactive (402 status)
  - Returns "Error: Rate limit exceeded" if too many requests (429 status)
  - Returns "Error: Server error" if Superagent service has issues (500 status)`,
    inputSchema: GuardInputSchema.shape,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true
    }
  },
  async (params: GuardInput) => {
    try {
      // Call Superagent Guard API
      const response = await callGuardApi(params.text);

      // Parse the classification from the response
      const messageContent = response.choices[0]?.message?.content || "{}";
      const reasoning = response.choices[0]?.message?.reasoning || "";

      let classification: GuardClassification;
      try {
        classification = JSON.parse(messageContent) as GuardClassification;
      } catch (parseError) {
        // If parsing fails, provide detailed error information
        const errorMsg = parseError instanceof Error ? parseError.message : String(parseError);
        return {
          content: [{
            type: "text",
            text: `Error: Unable to parse classification result.\n\nParse Error: ${errorMsg}\n\nResponse length: ${messageContent.length} characters\n\nFull Response:\n${messageContent}\n\nReasoning: ${reasoning}`
          }]
        };
      }

      // Format response based on requested format
      let result: string;
      if (params.response_format === ResponseFormat.JSON) {
        result = formatGuardJson(params.text, classification, reasoning, response.usage);
      } else {
        result = formatGuardMarkdown(params.text, classification, reasoning, response.usage);
      }

      // Check character limit
      result = checkCharacterLimit(result);

      return {
        content: [{
          type: "text",
          text: result
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: handleApiError(error)
        }]
      };
    }
  }
);

// ============================================================================
// Tool: superagent_redact
// ============================================================================

server.registerTool(
  "superagent_redact",
  {
    title: "Superagent PII Redaction",
    description: `Redact sensitive information (PII/PHI) from text using Superagent's redaction AI model.

This tool uses Superagent's LM-Redact-20B model to identify and redact personally identifiable information (PII) and protected health information (PHI) from text. It supports both standard entity types and custom entity lists.

Args:
  - text (string): The text content to redact sensitive information from (max 50,000 characters)
  - entities (string[], optional): Custom entity types to redact. If not provided, defaults to standard PII entities.
    Standard entities include: SSN, EMAIL, PHONE_NUMBER, CREDIT_CARD, NAME, ADDRESS, DATE_OF_BIRTH, etc.
    Examples: ['EMAIL', 'SSN'], ['PHONE_NUMBER', 'CREDIT_CARD'], ['NAME', 'ADDRESS', 'EMAIL']
  - response_format ('markdown' | 'json'): Output format (default: 'markdown')
    - 'markdown': Human-readable format with sections for redacted text and changes made
    - 'json': Machine-readable structured data for programmatic processing

Returns:
  For JSON format:
  {
    "redacted_text": string,      // Text with sensitive information replaced by <ENTITY_REDACTED> tokens
    "reasoning": string,           // Explanation of what was redacted
    "original_text_preview": string,
    "usage": {
      "prompt_tokens": number,
      "completion_tokens": number,
      "total_tokens": number
    }
  }

  For Markdown format: Formatted sections including the redacted text, changes made, and original text preview.

Examples:
  - Use when: Processing user-submitted content that may contain PII
  - Use when: "Redact personal information from: 'My email is john@example.com and SSN is 123-45-6789'"
  - Use when: Preparing data for logging or analytics while preserving privacy
  - Use when: Compliance requirements mandate PII removal (GDPR, HIPAA, etc.)
  - Don't use when: You need to detect security threats (use superagent_guard instead)

Common Entity Types:
  - EMAIL: Email addresses
  - SSN: Social Security Numbers
  - PHONE_NUMBER: Phone numbers in various formats
  - CREDIT_CARD: Credit card numbers
  - NAME: Person names
  - ADDRESS: Physical addresses
  - DATE_OF_BIRTH: Birth dates
  - MEDICAL_RECORD_NUMBER: Medical record identifiers
  - IP_ADDRESS: IP addresses
  - ACCOUNT_NUMBER: Bank or account numbers

Error Handling:
  - Returns "Error: Invalid request" if text is empty or exceeds length limits (400 status)
  - Returns "Error: Invalid request" if entities array is malformed (400 status)
  - Returns "Error: Authentication failed" if API key is invalid (401 status)
  - Returns "Error: Payment required" if subscription is inactive (402 status)
  - Returns "Error: Rate limit exceeded" if too many requests (429 status)
  - Returns "Error: Server error" if Superagent service has issues (500 status)`,
    inputSchema: RedactInputSchema.shape,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true
    }
  },
  async (params: RedactInput) => {
    try {
      // Call Superagent Redact API
      const response = await callRedactApi(params.text, params.entities);

      // Extract redacted text and reasoning
      const redactedText = response.choices[0]?.message?.content || "";
      const reasoning = response.choices[0]?.message?.reasoning || "";

      if (!redactedText) {
        return {
          content: [{
            type: "text",
            text: "Error: No redacted text returned from API."
          }]
        };
      }

      // Format response based on requested format
      let result: string;
      if (params.response_format === ResponseFormat.JSON) {
        result = formatRedactJson(params.text, redactedText, reasoning, response.usage);
      } else {
        result = formatRedactMarkdown(params.text, redactedText, reasoning, response.usage);
      }

      // Check character limit
      result = checkCharacterLimit(result);

      return {
        content: [{
          type: "text",
          text: result
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: handleApiError(error)
        }]
      };
    }
  }
);

// ============================================================================
// Main Function
// ============================================================================

async function main() {
  // Verify environment variables
  if (!process.env.SUPERAGENT_API_KEY) {
    console.error("ERROR: SUPERAGENT_API_KEY environment variable is required");
    console.error("\nTo use this MCP server, you need a Superagent API key:");
    console.error("1. Sign up at https://superagent.sh");
    console.error("2. Get your API key from the dashboard");
    console.error("3. Set the environment variable: export SUPERAGENT_API_KEY=your_key_here");
    process.exit(1);
  }

  // Create stdio transport
  const transport = new StdioServerTransport();

  // Connect server to transport
  await server.connect(transport);

  // Log to stderr (stdout is reserved for MCP protocol)
  console.error("Superagent MCP server running via stdio");
  console.error("Tools available: superagent_guard, superagent_redact");
}

// Run the server
main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
