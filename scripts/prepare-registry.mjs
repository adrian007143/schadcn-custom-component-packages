import { readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const workspaceRoot = process.cwd()
const templatePath = resolve(workspaceRoot, "registry.template.json")
const outputPath = resolve(workspaceRoot, "registry.json")

function normalizeBaseUrl(value) {
  return value.replace(/\/+$/, "")
}

function isLocalhostUrl(value) {
  return /^https?:\/\/(localhost|127(?:\.\d{1,3}){3})(:\d+)?$/i.test(value)
}

function resolveRegistryBaseUrl(templateJson) {
  const productionDefault =
    process.env.NODE_ENV === "production"
      ? "https://formkitcn.pro"
      : undefined

  const candidates = [
    process.env.REGISTRY_BASE_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined,
    productionDefault,
    templateJson.homepage,
    "http://localhost:3000",
  ].filter(
    (candidate) =>
      typeof candidate === "string" &&
      candidate.trim().length > 0 &&
      !candidate.includes("{{REGISTRY_BASE_URL}}")
  )

  const baseUrl = candidates.find(
    (candidate) => typeof candidate === "string" && candidate.trim().length > 0
  )

  if (!baseUrl) {
    throw new Error("Unable to resolve a registry base URL.")
  }

  const normalized = normalizeBaseUrl(baseUrl)

  if (!/^https?:\/\//.test(normalized)) {
    throw new Error(
      `Registry base URL must be absolute (received "${normalized}").`
    )
  }

  return normalized
}

const template = JSON.parse(readFileSync(templatePath, "utf8"))
const registryBaseUrl = resolveRegistryBaseUrl(template)

if (process.env.NODE_ENV === "production" && isLocalhostUrl(registryBaseUrl)) {
  throw new Error(
    "Production registry build requires REGISTRY_BASE_URL to be set to a non-localhost absolute URL."
  )
}

const serialized = JSON.stringify(template, null, 2).replaceAll(
  "{{REGISTRY_BASE_URL}}",
  registryBaseUrl
)

writeFileSync(outputPath, `${serialized}\n`, "utf8")

console.log(`Prepared registry.json with base URL: ${registryBaseUrl}`)
