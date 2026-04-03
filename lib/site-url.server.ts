import { headers } from "next/headers"

/**
 * Server-only: reads the host from request headers to build the base URL.
 * Works on localhost, Vercel, and any custom domain automatically.
 * DO NOT import this in client components.
 */
export async function getBaseUrl(): Promise<string> {
  const headersList = await headers()
  const host =
    headersList.get("x-forwarded-host") ||
    headersList.get("host") ||
    "localhost:3000"
  const proto =
    headersList.get("x-forwarded-proto") ||
    (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https")
  return `${proto}://${host}`
}
