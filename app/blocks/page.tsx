"use client"

import { useState } from "react"
import { Check, Copy, ArrowRight, Search } from "lucide-react"
import Link from "next/link"
import { REGISTRY_ITEMS, type RegistryItem } from "@/lib/registry-manifest"
import { getClientBaseUrl, buildInstallCommand } from "@/lib/site-url"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "forms", label: "Forms" },
  { value: "data-table", label: "Data Table" },
  { value: "redux", label: "Redux" },
]

const CATEGORY_LABELS: Record<string, string> = {
  forms: "Forms",
  "data-table": "Data Table",
  redux: "Redux",
}

function CopyInstallButton({ registryFile }: { registryFile: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(buildInstallCommand(getClientBaseUrl(), registryFile))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      {copied ? "Copied!" : "Copy install"}
    </Button>
  )
}

function BlockCard({ item }: { item: RegistryItem }) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm leading-snug">{item.title}</h3>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {CATEGORY_LABELS[item.category] ?? item.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-3 space-y-3">
        <p className="text-xs text-muted-foreground leading-relaxed">
          {item.description}
        </p>
        {item.dependencies.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.dependencies.map((dep) => (
              <code
                key={dep}
                className="text-xs bg-muted rounded px-1.5 py-0.5 font-mono"
              >
                {dep}
              </code>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 pt-0 flex-wrap">
        <CopyInstallButton registryFile={item.registryFile} />
        {item.previewPath && (
          <Button variant="ghost" size="sm" asChild>
            <Link href={item.previewPath} className="gap-1">
              Preview <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        )}
        {item.docsPath && (
          <Button variant="ghost" size="sm" asChild>
            <Link href={item.docsPath} className="gap-1 text-muted-foreground">
              Docs
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default function BlocksPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")

  const filtered = REGISTRY_ITEMS.filter((item) => {
    const matchesSearch =
      search.trim() === "" ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase())

    const matchesCategory = category === "all" || item.category === category

    return matchesSearch && matchesCategory
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Registry Blocks</h1>
        <p className="mt-2 text-muted-foreground">
          {REGISTRY_ITEMS.length} blocks available. Install any block with one
          command using the shadcn CLI.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search blocks..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.value}
              variant={category === cat.value ? "default" : "outline"}
              size="sm"
              onClick={() => setCategory(cat.value)}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          No blocks match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <BlockCard key={item.name} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
