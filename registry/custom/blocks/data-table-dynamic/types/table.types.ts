import type { DynamicColumnDef } from "./column.types"

export type ViewMode = "compact" | "comfortable" | "spacious"

export interface DynamicDataTableProps<TData extends Record<string, unknown>> {
  data: TData[]
  columnConfig: DynamicColumnDef<TData>[]

  rowIdKey: keyof TData & string

  enableRowSelection?: boolean
  enableRowDrag?: boolean
  enableColumnDrag?: boolean
  enableColumnVisibility?: boolean
  enableGlobalFilter?: boolean

  viewMode?: ViewMode

  toolbarTitle?: string
  toolbarSubtitle?: string

  onViewRow?: (row: TData) => void
  onEditRow?: (row: TData) => void
  onDeleteRow?: (row: TData) => void

  onDataChange?: (rows: TData[]) => void
  onAddRow?: () => void
}

