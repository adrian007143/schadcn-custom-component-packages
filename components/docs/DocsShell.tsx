"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { DocsSidebar } from "./DocsSidebar"

const NAV_ORDER = [
  { href: "/docs/introduction", label: "Introduction" },
  { href: "/docs/getting-started", label: "Installation" },
  { href: "/docs/form-field", label: "DynamicFormField" },
  { href: "/docs/form-builder", label: "FormBuilderStandard" },
  { href: "/docs/form-layout", label: "Form Layout" },
  { href: "/docs/multistep-form", label: "MultiStepForm" },
  { href: "/docs/data-table", label: "DynamicDataTable" },
  { href: "/docs/redux", label: "Redux Setup" },
]

function DocsNav() {
  const pathname = usePathname()
  const currentIndex = NAV_ORDER.findIndex((item) => item.href === pathname)
  const prev = currentIndex > 0 ? NAV_ORDER[currentIndex - 1] : null
  const next = currentIndex < NAV_ORDER.length - 1 ? NAV_ORDER[currentIndex + 1] : null

  if (!prev && !next) return null

  return (
    <div className="mt-12 flex items-center justify-between border-t pt-6">
      {prev ? (
        <Link
          href={prev.href}
          className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <div>
            <div className="text-xs text-muted-foreground/60 mb-0.5">Previous</div>
            <div className="font-medium">{prev.label}</div>
          </div>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={next.href}
          className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors text-right"
        >
          <div>
            <div className="text-xs text-muted-foreground/60 mb-0.5">Next</div>
            <div className="font-medium">{next.label}</div>
          </div>
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  )
}

export function DocsShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      className="docs-sidebar-offset"
      style={{ "--docs-header-offset": "3.5rem" } as React.CSSProperties}
    >
      <DocsSidebar />
      <SidebarInset>
        {/* Header bar with sidebar toggle */}
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm text-muted-foreground">Documentation</span>
        </header>

        <main className="flex-1 p-6 lg:p-10 max-w-4xl">
          <div className="docs-prose prose prose-neutral dark:prose-invert max-w-none">
            {children}
          </div>
          <DocsNav />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
