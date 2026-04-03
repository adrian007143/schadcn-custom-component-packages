import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InstallSnippet } from "@/components/site/landing/InstallSnippet"
import { getBaseUrl } from "@/lib/site-url.server"
import { buildInstallCommand } from "@/lib/site-url"

interface ExamplePageShellProps {
  title: string
  description: string
  registryFile: string  // e.g. "form-field.json"
  children: React.ReactNode
}

export async function ExamplePageShell({
  title,
  description,
  registryFile,
  children,
}: ExamplePageShellProps) {
  const baseUrl = await getBaseUrl()
  const installCommand = buildInstallCommand(baseUrl, registryFile)

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

      <div className="rounded-lg border bg-card/30 p-4 sm:p-8">
        {children}
      </div>
    </div>
  )
}
