import DataTableDynamic from "@/components/examples/data-table-dynamic"
import { ExamplePageShell } from "@/components/site/ExamplePageShell"

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
