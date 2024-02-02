import { PostHog } from "posthog-node"

export default function PostHogClient() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST

  if (!key || !host) {
    throw new Error("PostHog key and host must be defined")
  }

  const posthogClient = new PostHog(key, {
    host: host,
    flushAt: 1,
    flushInterval: 0,
  })
  return posthogClient
}
