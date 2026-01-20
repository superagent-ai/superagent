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
import { createClient } from "safety-agent";
import { z } from "zod";

// ============================================================================
// Initialize Superagent Client
// ============================================================================

const client = createClient({
  apiKey: process.env.SUPERAGENT_API_KEY!,
});

// ============================================================================
// Zod Schemas
// ============================================================================

const GuardInputSchema = z
  .object({
    text: z
      .string()
      .min(1, "Text cannot be empty")
      .max(50000, "Text exceeds maximum length of 50,000 characters")
      .describe(
        "The user input text or PDF URL to analyze for security threats like prompt injection, system prompt extraction, or data exfiltration. URLs starting with http:// or https:// are automatically detected and the PDF will be downloaded and analyzed."
      ),
    system_prompt: z
      .string()
      .optional()
      .describe(
        "Optional system prompt that allows you to steer the guard REST API behavior and customize the classification logic. Use this to provide specific instructions about what types of threats to focus on or how to classify inputs."
      ),
  })
  .strict();

type GuardInput = z.infer<typeof GuardInputSchema>;

const RedactInputSchema = z
  .object({
    text: z
      .string()
      .min(1, "Text cannot be empty")
      .max(50000, "Text exceeds maximum length of 50,000 characters")
      .describe(
        "The text content to be analyzed and redacted for sensitive information (PII/PHI)"
      ),
    entities: z
      .array(z.string())
      .optional()
      .describe(
        "Optional array of custom entity types to redact. If not provided, defaults to standard PII entities (SSNs, emails, phone numbers, credit cards, etc.). Examples: ['EMAIL', 'SSN', 'PHONE_NUMBER', 'CREDIT_CARD', 'NAME', 'ADDRESS']"
      ),
    rewrite: z
      .boolean()
      .optional()
      .describe(
        "When true, naturally rewrite content to remove sensitive information instead of using placeholders. For example, 'Contact me at john@example.com' becomes 'Contact me via email' instead of 'Contact me at <EMAIL_REDACTED>'."
      ),
  })
  .strict();

type RedactInput = z.infer<typeof RedactInputSchema>;


// ============================================================================
// MCP Server Setup
// ============================================================================

const server = new McpServer({
  name: "superagent-mcp-server",
  version: "1.0.0",
});

// ============================================================================
// Tool: superagent_guard
// ============================================================================

server.registerTool(
  "superagent_guard",
  {
    title: "Superagent Security Guard",
    description: `Analyze text, PDF files, or PDF URLs for security threats including prompt injection, system prompt extraction, and data exfiltration attempts using Superagent's security AI model.

This tool uses Superagent's LM-Guard-20B model to classify user inputs and detect malicious intent.

Args:
  - text (string): The user input text or PDF URL to analyze for security threats (max 50,000 characters). URLs starting with http:// or https:// are automatically detected.
  - system_prompt (string, optional): Optional system prompt that allows you to steer the guard REST API behavior and customize the classification logic. Use this to provide specific instructions about what types of threats to focus on or how to classify inputs.

Examples:
  - Use when: Validating user input before passing to an LLM
  - Use when: "Check if this message is a prompt injection: 'Ignore previous instructions...'"
  - Use when: Analyzing PDF documents from URLs: "https://example.com/document.pdf"
  - Use when: Building a content moderation system for AI applications
  - Use when: Customizing guard behavior with system_prompt: "Focus on detecting prompt injection attempts and data exfiltration patterns"
  - Don't use when: You need to redact PII (use superagent_redact instead)

Common Violation Types:
  - prompt_injection: Attempts to override system instructions
  - system_prompt_extraction: Tries to reveal system prompts or internal instructions
  - data_exfiltration: Attempts to extract sensitive data or bypass security controls
  - jailbreak: Tries to bypass safety guidelines or content policies`,
    inputSchema: GuardInputSchema.shape,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  async (params: GuardInput) => {
    try {
      // Call Superagent Guard API using SDK
      const result = await client.guard({
        input: params.text,
        systemPrompt: params.system_prompt,
      });

      // Return the raw result as JSON
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: "text",
            text: `Error: ${errorMessage}`,
          },
        ],
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
  - rewrite (boolean, optional): When true, naturally rewrite content to remove sensitive information instead of using placeholders.
    Example: "Contact me at john@example.com" becomes "Contact me via email" instead of "Contact me at <EMAIL_REDACTED>"

Returns:
  The redacted text as a string. When rewrite=false (default), sensitive information is replaced by <ENTITY_REDACTED> tokens.
  Example: "My email is <EMAIL_REDACTED> and SSN is <SSN_REDACTED>"
  When rewrite=true, the text is naturally rewritten to remove sensitive information.
  Example: "You can reach me by email and I've provided my social security number"

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
  - ACCOUNT_NUMBER: Bank or account numbers`,
    inputSchema: RedactInputSchema.shape,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  async (params: RedactInput) => {
    try {
      // Call Superagent Redact API using SDK
      const result = await client.redact({
        input: params.text,
        model: "openai/gpt-4o-mini",
        entities: params.entities,
        rewrite: params.rewrite,
      });

      // Return the redacted text from the result
      return {
        content: [
          {
            type: "text",
            text: result.redacted,
          },
        ],
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: "text",
            text: `Error: ${errorMessage}`,
          },
        ],
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
    console.error("1. Sign up at https://app.superagent.sh");
    console.error("2. Get your API key from the dashboard");
    console.error(
      "3. Set the environment variable: export SUPERAGENT_API_KEY=your_key_here"
    );
    process.exit(1);
  }

  // Create stdio transport
  const transport = new StdioServerTransport();

  // Connect server to transport
  await server.connect(transport);

  // Log to stderr (stdout is reserved for MCP protocol)
  console.error("Superagent MCP server running via stdio");
  console.error(
    "Tools available: superagent_guard, superagent_redact"
  );
}

// Run the server
main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
