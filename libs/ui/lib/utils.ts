import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function encodeToIdentifier(agentId: string, apiKey: string): string {
  const combined = `${agentId}|${apiKey}`
  const buffer = Buffer.from(combined, "utf8")
  return buffer.toString("base64")
}

export function decodeFromIdentifier(identifier: string): {
  agentId: string
  apiKey: string
} {
  const buffer = Buffer.from(identifier, "base64")
  const combined = buffer.toString("utf8")
  const [agentId, apiKey] = combined.split("|")
  return { agentId, apiKey }
}
