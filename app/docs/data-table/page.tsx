import type { Metadata } from "next";

import Content from "./content.mdx";

export const metadata: Metadata = {
  title: "Data Grid - Editable TanStack Table",
  description:
    "DataGrid is a fully featured editable data grid built on TanStack Table v8. It supports inline cell editing, drag-and-drop row reordering, faceted filtering, column visibility toggles, and custom cell renderers.",
  alternates: { canonical: "https://formkitcn.pro/docs/data-table" },
  openGraph: {
    title: "Data Grid - FormKitCN Docs",
    description:
      "TanStack Table v8 with inline editing, drag-and-drop, faceted filtering, and column visibility.",
    url: "https://formkitcn.pro/docs/data-table",
  },
};

export default function DataTablePage() {
  return <Content />;
}
