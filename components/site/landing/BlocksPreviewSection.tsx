"use client"

import Link from "next/link"
import { useState } from "react"
import { Check, Copy, ArrowRight, Blocks } from "lucide-react"
import { LISTED_REGISTRY_ITEMS } from "@/lib/registry-manifest"
import { getClientBaseUrl, buildInstallCommand } from "@/lib/site-url"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const CATEGORY_COLORS: Record<string, string> = {
  forms: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  "data-table": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  redux: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
}

const CATEGORY_LABELS: Record<string, string> = {
  forms: "Forms",
  "data-table": "Data Table",
  redux: "Redux",
}

function CopyButton({ registryFile }: { registryFile: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const command = buildInstallCommand(getClientBaseUrl(), registryFile)
    navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5 h-8 text-xs">
      {copied ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
      {copied ? "Copied!" : "Copy install"}
    </Button>
  )
}

export function BlocksPreviewSection() {
  return (
    <section className="py-20 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 shrink-0">
              <Blocks className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Registry Blocks
              </h2>
              <p className="mt-1 text-muted-foreground">
                {LISTED_REGISTRY_ITEMS.length} blocks ready to install into your project.
              </p>
            </div>
          </div>
          <Button variant="outline" asChild className="shrink-0 gap-1.5">
            <Link href="/blocks">
              Browse all blocks <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LISTED_REGISTRY_ITEMS.map((item) => (
            <div
              key={item.name}
              className="group flex flex-col rounded-xl border bg-card p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-semibold text-sm leading-snug">{item.title}</h3>
                <Badge
                  variant="outline"
                  className={`shrink-0 text-xs border ${CATEGORY_COLORS[item.category] ?? ""}`}
                >
                  {CATEGORY_LABELS[item.category] ?? item.category}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-1 mb-4">
                {item.description}
              </p>

              <div className="flex items-center gap-2 pt-3 border-t border-dashed">
                <CopyButton registryFile={item.registryFile} />
                {item.previewPath && (
                  <Button variant="ghost" size="sm" asChild className="h-8 text-xs gap-1">
                    <Link href={item.previewPath}>
                      Preview <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
