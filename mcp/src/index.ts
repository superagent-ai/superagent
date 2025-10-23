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
import { createClient } from "superagent-ai";
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
        "The user input text to analyze for security threats like prompt injection, system prompt extraction, or data exfiltration"
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
  })
  .strict();

type RedactInput = z.infer<typeof RedactInputSchema>;

const VerifyInputSchema = z
  .object({
    text: z
      .string()
      .min(1, "Text cannot be empty")
      .max(50000, "Text exceeds maximum length of 50,000 characters")
      .describe("The text containing claims to verify against source materials"),
    sources: z
      .array(
        z.object({
          content: z
            .string()
            .min(1, "Source content cannot be empty")
            .describe("The content of the source material"),
          name: z
            .string()
            .min(1, "Source name cannot be empty")
            .describe("The name or identifier of the source"),
          url: z
            .string()
            .optional()
            .describe("Optional URL of the source"),
        })
      )
      .min(1, "At least one source is required")
      .describe(
        "Array of source materials to verify claims against. Each source must have 'content' and 'name' fields, and optionally a 'url' field."
      ),
  })
  .strict();

type VerifyInput = z.infer<typeof VerifyInputSchema>;

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
    description: `Analyze text for security threats including prompt injection, system prompt extraction, and data exfiltration attempts using Superagent's security AI model.

This tool uses Superagent's LM-Guard-20B model to classify user inputs and detect malicious intent.

Args:
  - text (string): The user input text to analyze for security threats (max 50,000 characters)

Examples:
  - Use when: Validating user input before passing to an LLM
  - Use when: "Check if this message is a prompt injection: 'Ignore previous instructions...'"
  - Use when: Building a content moderation system for AI applications
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
      const result = await client.guard(params.text);

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

Returns:
  The redacted text as a string with sensitive information replaced by <ENTITY_REDACTED> tokens.
  Example: "My email is <EMAIL_REDACTED> and SSN is <SSN_REDACTED>"

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
      const result = await client.redact(params.text, {
        entities: params.entities,
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
// Tool: superagent_verify
// ============================================================================

server.registerTool(
  "superagent_verify",
  {
    title: "Superagent Claim Verification",
    description: `Verify claims in text against provided source materials using Superagent's verification AI model.

This tool uses Superagent's LM-Verify-20B model to analyze claims and determine whether they are supported, contradicted, or unverifiable based on the provided sources.

Args:
  - text (string): The text containing claims to verify (max 50,000 characters)
  - sources (array): Array of source materials to verify claims against. Each source must have:
    - content (string): The content of the source material
    - name (string): The name or identifier of the source
    - url (string, optional): URL of the source

Returns:
  JSON containing an array of verified claims, each with:
  - claim: The specific claim being verified
  - verdict: True if supported by sources, false if contradicted or unverifiable
  - sources: List of sources used for verification (with name and URL)
  - evidence: Relevant quotes or excerpts from the sources
  - reasoning: Brief explanation for the verdict

Examples:
  - Use when: Fact-checking content against authoritative sources
  - Use when: "Verify this claim: 'The company was founded in 2020' against the About Us page"
  - Use when: Validating information in reports against source data
  - Use when: Checking consistency between different documents
  - Don't use when: You need to redact PII (use superagent_redact instead)
  - Don't use when: You need to detect security threats (use superagent_guard instead)

Verification Rules:
  - Only uses information explicitly stated in the provided sources
  - Returns true verdict if claim is directly backed by sources
  - Returns false verdict if claim is contradicted or cannot be verified
  - Provides specific source references and evidence for each claim
  - Breaks down text into individual verifiable claims`,
    inputSchema: VerifyInputSchema.shape,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  async (params: VerifyInput) => {
    try {
      // Call Superagent Verify API using SDK
      const result = await client.verify(params.text, params.sources);

      // Return the verification result as formatted JSON
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                claims: result.claims,
                usage: result.usage,
              },
              null,
              2
            ),
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
  console.error("Tools available: superagent_guard, superagent_redact, superagent_verify");
}

// Run the server
main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
