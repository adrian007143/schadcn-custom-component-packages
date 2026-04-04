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
      <div className="not-prose my-5 overflow-x-auto rounded-lg border">
        <table className="w-full text-sm" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }) => (
      <thead className="border-b bg-muted/50" {...props}>
        {children}
      </thead>
    ),
    tbody: ({ children, ...props }) => (
      <tbody {...props}>{children}</tbody>
    ),
    tr: ({ children, ...props }) => (
      <tr className="border-b last:border-0 transition-colors hover:bg-muted/20" {...props}>
        {children}
      </tr>
    ),
    th: ({ children, ...props }) => (
      <th className="px-4 py-2.5 text-left font-medium text-foreground" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="px-4 py-2.5 text-muted-foreground" {...props}>
        {children}
      </td>
    ),

    ...components,
  }
}
