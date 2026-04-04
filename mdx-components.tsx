import React from "react"
import type { MDXComponents } from "mdx/types"
import { Callout } from "@/components/docs/Callout"
import { PropsTable } from "@/components/docs/PropsTable"
import { InstallCmd } from "@/components/docs/InstallCmd"
import { CopyableCode } from "@/components/docs/CopyableCode"
import { FieldTypeGrid } from "@/components/docs/FieldTypeGrid"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Custom components available in all MDX files
    Callout,
    PropsTable,
    InstallCmd,
    FieldTypeGrid,

    // Code blocks → CopyableCode with shiki highlighting + copy button
    // Cast needed because Next.js RSC async components aren't in React's standard types
    pre: CopyableCode as unknown as React.ComponentType,

    // Styled markdown tables
    table: ({ children, ...props }) => (
      <div className="not-prose my-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm border-collapse" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }) => (
      <thead className="bg-muted/60 border-b border-border" {...props}>
        {children}
      </thead>
    ),
    tbody: ({ children, ...props }) => (
      <tbody className="divide-y divide-border" {...props}>{children}</tbody>
    ),
    tr: ({ children, ...props }) => (
      <tr className="transition-colors hover:bg-muted/30" {...props}>
        {children}
      </tr>
    ),
    th: ({ children, ...props }) => (
      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="px-4 py-3 text-sm text-foreground/90 align-top" {...props}>
        {children}
      </td>
    ),

    ...components,
  }
}
