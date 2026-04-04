import type { Metadata } from "next"
import Content from "./content.mdx"

export const metadata: Metadata = {
  title: "DynamicDataTable — Editable TanStack Table",
  description:
    "DynamicDataTable is a fully featured editable data table built on TanStack Table v8. Supports inline cell editing, drag-and-drop row/column reordering, faceted filtering, column visibility toggles, and custom cell renderers.",
  alternates: { canonical: "https://formkitcn.pro/docs/data-table" },
  openGraph: {
    title: "DynamicDataTable — FormKitCN Docs",
    description:
      "TanStack Table v8 with inline editing, drag-and-drop, faceted filtering, and column visibility.",
    url: "https://formkitcn.pro/docs/data-table",
  },
}

export default function DataTablePage() {
  return <Content />
}
