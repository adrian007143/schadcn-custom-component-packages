"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { SelectCell } from "./select-cell"
import { BadgeCell } from "./badge-cell"
import { DatepickerCell } from "./datepicker-cell"
import type {
  ColumnInputType,
  DynamicColumnDef,
  EditableInputProps,
} from "./../types/column.types"

interface EditableCellProps<TData, TValue>
  extends EditableInputProps<TData, TValue> {
  col: DynamicColumnDef<TData, TValue>
}

export function EditableCell<TData, TValue>({
  value: initialValue,
  row,
  rowId,
  accessorKey,
  onChange,
  col,
}: EditableCellProps<TData, TValue>) {
  const inputType: ColumnInputType = col.inputType ?? "text"
  const [value, setValue] = React.useState(initialValue)

  // Sync with external updates
  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  // Helper: Commit change immediately on blur/select
  const onCommit = (newValue: unknown) => {
    setValue(newValue as TValue)
    onChange(newValue as TValue)
  }

  // Helper for type conversions
  const asString = (v: unknown): string => (v === null || v === undefined ? "" : String(v))
  const asDateOrNull = (v: unknown): Date | null => {
    if (!v) return null
    return v instanceof Date ? v : new Date(String(v))
  }

  switch (inputType) {
    case "text":
      return (
        <Input
          className="h-8 w-full min-w-[100px] border border-border"
          value={asString(value)}
          onChange={(e) => setValue(e.target.value as unknown as TValue)}
          onBlur={() => onCommit(value)}
        />
      )

    case "number":
      return (
        <Input
          type="number"
          className="h-8 w-full min-w-[80px]"
          value={asString(value)}
          onChange={(e) => setValue(e.target.value as unknown as TValue)}
          onBlur={() => onCommit(value)}
        />
      )

    case "select":
      return (
        <SelectCell
          value={value}
          options={col.selectOptions ?? []}
          onChange={onCommit}
        
        />
      )

    case "datepicker":
      return (
        <DatepickerCell
          value={asDateOrNull(value)}
          onChange={onCommit}
          dateFormat={col.dateFormat}
        />
      )

    case "badge":
      return <BadgeCell value={value} variant={col.badgeVariant} />

    case "custom":
      if (col.cellRenderInput) {
        return col.cellRenderInput({
          value,
          row,
          rowId,
          accessorKey,
          onChange: onCommit,
        })
      }
      return <span>{asString(value)}</span>

    default:
      return <span>{asString(value)}</span>
  }
}