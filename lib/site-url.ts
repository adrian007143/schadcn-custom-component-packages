function normalizeBaseUrl(value: string): string {
  return value.replace(/\/+$/, "")
}

/**
 * Client-side: reads from window.location.origin.
 * Falls back to public env config during prerender so static docs do not render relative URLs.
 */
export function getClientBaseUrl(): string {
  if (typeof window !== "undefined") {
    return normalizeBaseUrl(window.location.origin)
  }

  const fallback =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://formkitcn.pro"
      : "http://localhost:3000")

  return normalizeBaseUrl(fallback)
}

/**
 * Builds the full npx install command for a registry block.
 */
export function buildInstallCommand(baseUrl: string, registryFile: string): string {
  return `npx shadcn@latest add ${baseUrl}/r/${registryFile}`
}
