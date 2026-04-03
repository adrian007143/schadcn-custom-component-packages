/**
 * Client-side: reads from window.location.origin.
 * Safe to call in both client components and server components (returns "" on server).
 */
export function getClientBaseUrl(): string {
  if (typeof window === "undefined") return ""
  return window.location.origin
}

/**
 * Builds the full npx install command for a registry block.
 */
export function buildInstallCommand(baseUrl: string, registryFile: string): string {
  return `npx shadcn@latest add ${baseUrl}/r/${registryFile}`
}
