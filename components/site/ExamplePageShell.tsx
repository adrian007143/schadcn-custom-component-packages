import fs from "fs"
import path from "path"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InstallSnippet } from "@/components/site/landing/InstallSnippet"
import { getBaseUrl } from "@/lib/site-url.server"
import { buildInstallCommand } from "@/lib/site-url"
import { BlockPreviewTabs } from "@/components/site/BlockPreviewTabs"
import { codeToHtml } from "shiki"

interface ExamplePageShellProps {
  title: string
  description: string
  registryFile: string
  /** Relative paths from project root, e.g. "components/examples/form-ui-dynamic-template.tsx" */
  codeFiles?: string[]
  children: React.ReactNode
}

async function highlightFile(relPath: string) {
  const absPath = path.join(process.cwd(), relPath)
  let rawCode = ""
  try {
    rawCode = fs.readFileSync(absPath, "utf-8")
  } catch {
    rawCode = `// Could not load source: ${relPath}`
  }

  const ext = path.extname(relPath).replace(".", "")
  const lang = ext === "tsx" || ext === "ts" ? "tsx" : ext || "text"
  const filename = path.basename(relPath)

  let highlightedHtml = ""
  try {
    highlightedHtml = await codeToHtml(rawCode, { lang, theme: "github-dark-dimmed" })
  } catch {
    highlightedHtml = `<pre><code>${rawCode.replace(/</g, "&lt;")}</code></pre>`
  }

  return { filename, lang, highlightedHtml, rawCode }
}

export async function ExamplePageShell({
  title,
  description,
  registryFile,
  codeFiles = [],
  children,
}: ExamplePageShellProps) {
  const baseUrl = await getBaseUrl()
  const installCommand = buildInstallCommand(baseUrl, registryFile)

  const files = await Promise.all(codeFiles.map(highlightFile))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="-ml-2 mb-4">
          <Link href="/blocks" className="gap-1.5 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            All blocks
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1.5 text-muted-foreground">{description}</p>
        <div className="mt-4">
          <InstallSnippet command={installCommand} />
        </div>
      </div>

      {files.length > 0 ? (
        <BlockPreviewTabs files={files}>{children}</BlockPreviewTabs>
      ) : (
        <div className="rounded-lg border bg-card/30 p-4 sm:p-8">{children}</div>
      )}
    </div>
  )
}
