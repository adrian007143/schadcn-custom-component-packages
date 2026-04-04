import type { Metadata } from "next"
import DataTableDynamic from "@/components/examples/data-table-dynamic"
import { ExamplePageShell } from "@/components/site/ExamplePageShell"

export const metadata: Metadata = {
  title: "Dynamic Data Table Example",
  description:
    "Live preview of FormKitCN's DynamicDataTable built on TanStack Table v8. Features inline cell editing, drag-and-drop row/column reordering, faceted filtering, and column visibility toggles.",
  alternates: { canonical: "https://formkitcn.pro/blocks/data-table-dynamic" },
  openGraph: {
    title: "Dynamic Data Table — FormKitCN Block Preview",
    description:
      "TanStack Table with inline editing, drag-and-drop, faceted filtering. One CLI install.",
    url: "https://formkitcn.pro/blocks/data-table-dynamic",
  },
}

export default function DataTablePage() {
  return (
    <ExamplePageShell
      title="Dynamic Data Table"
      description="Fully dynamic, editable, draggable data table with inline editing, drag-and-drop rows/columns, faceted filtering, and custom cell types."
      registryFile="data-table-dynamic.json"
      codeFiles={["components/examples/data-table-dynamic.tsx"]}
    >
      <DataTableDynamic />
    </ExamplePageShell>
  )
}
