/**
 * API client for Superagent.sh
 */

import axios, { AxiosError } from "axios";
import { API_BASE_URL, API_TIMEOUT } from "./constants.js";
import type { GuardResponse, RedactResponse, ApiErrorResponse } from "./types.js";

/**
 * Get API key from environment
 */
function getApiKey(): string {
  const apiKey = process.env.SUPERAGENT_API_KEY;
  if (!apiKey) {
    throw new Error("SUPERAGENT_API_KEY environment variable is required");
  }
  return apiKey;
}

/**
 * Make a request to the Guard API
 */
export async function callGuardApi(text: string): Promise<GuardResponse> {
  try {
    const response = await axios.post<GuardResponse>(
      `${API_BASE_URL}/guard`,
      { text },
      {
        headers: {
          "Authorization": `Bearer ${getApiKey()}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        timeout: API_TIMEOUT,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        responseType: "json"
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Make a request to the Redact API
 */
export async function callRedactApi(
  text: string,
  entities?: string[]
): Promise<RedactResponse> {
  try {
    const payload: { text: string; entities?: string[] } = { text };
    if (entities && entities.length > 0) {
      payload.entities = entities;
    }

    const response = await axios.post<RedactResponse>(
      `${API_BASE_URL}/redact`,
      payload,
      {
        headers: {
          "Authorization": `Bearer ${getApiKey()}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        timeout: API_TIMEOUT,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        responseType: "json"
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Handle API errors and return user-friendly error messages
 */
export function handleApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data as ApiErrorResponse;
      const errorMessage = errorData?.error || "Unknown error";

      switch (status) {
        case 400:
          return `Error: Invalid request - ${errorMessage}. Please check your input parameters.`;
        case 401:
          return `Error: Authentication failed - ${errorMessage}. Please verify your SUPERAGENT_API_KEY is valid.`;
        case 402:
          return `Error: Payment required - ${errorMessage}. Please check your Superagent subscription status.`;
        case 404:
          return `Error: Resource not found - ${errorMessage}. The API endpoint may have changed.`;
        case 429:
          return "Error: Rate limit exceeded. Please wait before making more requests.";
        case 500:
          return `Error: Server error - ${errorMessage}. The Superagent service may be experiencing issues.`;
        default:
          return `Error: API request failed with status ${status} - ${errorMessage}`;
      }
    } else if (error.code === "ECONNABORTED") {
      return "Error: Request timed out. Please try again or check your network connection.";
    } else if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
      return "Error: Cannot connect to Superagent API. Please check your network connection.";
    }
  }

  if (error instanceof Error) {
    return `Error: ${error.message}`;
  }

  return `Error: An unexpected error occurred - ${String(error)}`;
}
