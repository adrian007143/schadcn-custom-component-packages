import type { ColumnDef } from "@tanstack/react-table"
import type { ReactNode } from "react"

export type DisplayMode = "avatar" | "rounded" | "square"
export type ImageSize = "sm" | "md" | "lg" | "xl"

export type ColumnInputType =
  | "text"
  | "number"
  | "select"
  | "datepicker"
  | "badge"
  | "custom"
  | "none"

export interface EditableInputProps<TData, TValue> {
  value: TValue
  row: TData
  rowId: string | number
  accessorKey: keyof TData & string
  onChange: (value: TValue) => void
}

export type DynamicColumnDef<TData, TValue = unknown> = ColumnDef<TData, TValue> & {
  // FIX: Allow known keys OR any string (for nested paths like "role.name")
  accessorKey: (keyof TData & string) | (string & {})
  
  // Image-related
  displayMode?: DisplayMode
  imageSize?: ImageSize
  imageAltKey?: keyof TData & string

  // Editable-related
  editable?: boolean
  inputType?: ColumnInputType

  // Select input
  selectOptions?: { label: string; value: unknown }[]

  // Badge
  badgeVariant?: "default" | "secondary" | "outline" | "destructive"
  
  // Filter options for faceted filter
  filterOptions?: { label: string; value: string; icon?: React.ComponentType<{ className?: string }> }[]

  // Datepicker
  dateFormat?: string

  // Custom input renderer
  cellRenderInput?: (props: EditableInputProps<TData, TValue>) => ReactNode
}