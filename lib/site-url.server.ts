function normalizeBaseUrl(value: string): string {
  return value.replace(/\/+$/, "")
}

export function getBaseUrl(): string {
  const candidates = [
    process.env.REGISTRY_BASE_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.SITE_URL,
    process.env.COOLIFY_URL,
    process.env.COOLIFY_FQDN
      ? `https://${process.env.COOLIFY_FQDN}`
      : undefined,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined,
    process.env.NODE_ENV === "production"
      ? "https://formkitcn.pro"
      : "http://localhost:3000",
  ]

  const baseUrl = candidates.find(
    (candidate): candidate is string =>
      typeof candidate === "string" && candidate.trim().length > 0,
  )

  return normalizeBaseUrl(baseUrl ?? "http://localhost:3000")
}
