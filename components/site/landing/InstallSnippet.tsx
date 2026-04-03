"use client"

import { useState } from "react"
import { Check, Copy, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"

interface InstallSnippetProps {
  command: string
}

export function InstallSnippet({ command }: InstallSnippetProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border bg-muted/60 px-4 py-3 font-mono text-sm w-full max-w-xl shadow-sm backdrop-blur-sm">
      <Terminal className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <code className="flex-1 text-foreground truncate text-xs">{command}</code>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0 rounded-md hover:bg-background"
        onClick={handleCopy}
        aria-label="Copy command"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-green-500" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </Button>
    </div>
  )
}
