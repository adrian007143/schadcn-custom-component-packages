import React from "react"
import { codeToHtml } from "shiki"
import { CopyButton } from "./CopyButton"

interface CopyableCodeProps {
  children?: React.ReactNode
  [key: string]: unknown
}

function extractCode(children: React.ReactNode): { code: string; lang: string } {
  if (!React.isValidElement(children)) {
    return { code: String(children ?? "").trimEnd(), lang: "" }
  }
  const el = children as React.ReactElement<{ className?: string; children?: unknown }>
  const className = el.props?.className ?? ""
  const lang = className.replace("language-", "").trim()
  const raw = el.props?.children
  const code = Array.isArray(raw)
    ? raw.map(String).join("").trimEnd()
    : String(raw ?? "").trimEnd()
  return { code, lang }
}

export async function CopyableCode({ children }: CopyableCodeProps) {
  const { code, lang } = extractCode(children)

  const shikiLang = lang || "text"
  let html = ""

  try {
    html = await codeToHtml(code, {
      lang: shikiLang,
      theme: "github-dark-dimmed",
    })
  } catch {
    try {
      html = await codeToHtml(code, { lang: "text", theme: "github-dark-dimmed" })
    } catch {
      html = `<pre><code>${code}</code></pre>`
    }
  }

  return (
    <div className="not-prose group relative my-5 overflow-hidden rounded-xl border border-zinc-700/60 bg-[#22272e]">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-zinc-700/50 bg-zinc-900/40 px-4 py-2">
        <span className="text-xs font-mono text-zinc-500 select-none">
          {lang || "code"}
        </span>
        <CopyButton code={code} />
      </div>

      {/* Shiki-highlighted code */}
      <div
        className="overflow-x-auto [&>pre]:!bg-transparent [&>pre]:!m-0 [&>pre]:p-4 [&>pre]:text-sm [&>pre]:leading-relaxed [&>pre]:font-mono"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
