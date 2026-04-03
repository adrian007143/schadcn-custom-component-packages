export interface PropDefinition {
  name: string
  type: string
  required?: boolean
  default?: string
  description: string
}

interface PropsTableProps {
  items: PropDefinition[]
}

export function PropsTable({ items }: PropsTableProps) {
  return (
    <div className="my-4 overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-2.5 text-left font-medium">Prop</th>
            <th className="px-4 py-2.5 text-left font-medium">Type</th>
            <th className="px-4 py-2.5 text-left font-medium">Default</th>
            <th className="px-4 py-2.5 text-left font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {items.map((prop) => (
            <tr key={prop.name} className="border-b last:border-0">
              <td className="px-4 py-2.5 font-mono">
                {prop.name}
                {prop.required && (
                  <span className="ml-1 text-xs text-red-500">*</span>
                )}
              </td>
              <td className="px-4 py-2.5 font-mono text-muted-foreground text-xs">
                {prop.type}
              </td>
              <td className="px-4 py-2.5 text-muted-foreground">
                {prop.default ?? "—"}
              </td>
              <td className="px-4 py-2.5 text-muted-foreground">
                {prop.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
