"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CopyButton } from "@/components/docs/CopyButton"
import { Monitor, Code2 } from "lucide-react"

interface FileTab {
  filename: string
  lang: string
  highlightedHtml: string
  rawCode: string
}

/** Extract the last segment (basename) from a path for use as a short tab label */
function basename(filePath: string) {
  return filePath.split("/").pop() ?? filePath
}

interface BlockPreviewTabsProps {
  files: FileTab[]
  children: React.ReactNode
}

export function BlockPreviewTabs({ files, children }: BlockPreviewTabsProps) {
  return (
    <Tabs defaultValue="preview" className="w-full">
      <TabsList className="h-9 mb-4">
        <TabsTrigger value="preview" className="gap-1.5 text-xs">
          <Monitor className="h-3.5 w-3.5" />
          Preview
        </TabsTrigger>
        <TabsTrigger value="code" className="gap-1.5 text-xs">
          <Code2 className="h-3.5 w-3.5" />
          Code
        </TabsTrigger>
      </TabsList>

      <TabsContent value="preview">
        <div className="rounded-lg border bg-card/30 p-4 sm:p-8">
          {children}
        </div>
      </TabsContent>

      <TabsContent value="code">
        {files.length === 1 ? (
          <CodePanel file={files[0]} />
        ) : (
          <MultiFileCode files={files} />
        )}
      </TabsContent>
    </Tabs>
  )
}

function CodePanel({ file }: { file: FileTab }) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-700/60 bg-[#22272e]">
      <div className="flex items-center justify-between border-b border-zinc-700/50 bg-zinc-900/50 px-4 py-2">
        <span className="text-xs font-mono text-zinc-400 select-none">{file.filename}</span>
        <CopyButton code={file.rawCode} />
      </div>
      <div
        className="max-h-[600px] overflow-auto [&>pre]:!bg-transparent [&>pre]:!m-0 [&>pre]:p-4 [&>pre]:text-sm [&>pre]:leading-relaxed [&>pre]:font-mono"
        dangerouslySetInnerHTML={{ __html: file.highlightedHtml }}
      />
    </div>
  )
}

function MultiFileCode({ files }: { files: FileTab[] }) {
  return (
    <Tabs defaultValue={files[0]?.filename}>
      <div className="mb-2 flex items-center gap-2 border-b border-zinc-700/40 bg-[#1c2128] px-4 rounded-t-xl overflow-x-auto">
        <TabsList className="h-auto gap-0 rounded-none bg-transparent p-0 flex-shrink-0">
          {files.map((f) => (
            <TabsTrigger
              key={f.filename}
              value={f.filename}
              className="rounded-none border-b-2 border-transparent px-4 py-2.5 text-xs font-mono text-zinc-500 data-[state=active]:border-blue-400 data-[state=active]:text-zinc-100 data-[state=active]:bg-transparent whitespace-nowrap"
            >
              {basename(f.filename)}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {files.map((f) => (
        <TabsContent key={f.filename} value={f.filename} className="mt-0">
          <div className="overflow-hidden rounded-b-xl border border-t-0 border-zinc-700/60 bg-[#22272e]">
            <div className="flex items-center justify-between border-b border-zinc-700/50 bg-zinc-900/50 px-4 py-2">
              <span className="text-xs font-mono text-zinc-400 select-none">{f.filename}</span>
              <CopyButton code={f.rawCode} />
            </div>
            <div
              className="max-h-[600px] overflow-auto [&>pre]:!bg-transparent [&>pre]:!m-0 [&>pre]:p-4 [&>pre]:text-sm [&>pre]:leading-relaxed [&>pre]:font-mono"
              dangerouslySetInnerHTML={{ __html: f.highlightedHtml }}
            />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
