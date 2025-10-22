/**
 * Type definitions for Superagent API
 */

export enum ResponseFormat {
  MARKDOWN = "markdown",
  JSON = "json"
}

/**
 * Guard API Response
 */
export interface GuardResponse {
  id: string;
  model: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
      reasoning: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface GuardClassification {
  classification: "block" | "allow";
  violation_types?: string[];
  cwe_codes?: string[];
}

/**
 * Redact API Response
 */
export interface RedactResponse {
  id: string;
  model: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
      reasoning: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * API Error Response
 */
export interface ApiErrorResponse {
  error: string;
}
