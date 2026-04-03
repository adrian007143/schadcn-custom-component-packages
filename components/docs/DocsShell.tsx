"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DocsSidebar } from "./DocsSidebar"

export function DocsShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DocsSidebar />
      <SidebarInset>
        <main className="flex-1 p-6 lg:p-10 max-w-4xl">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
