"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";

import { DateCell } from "./DateCell";
import { SelectOptionCell } from "./SelectOptionCell";
import { StatusBadgeCell } from "./StatusBadgeCell";
import type {
  ColumnInputType,
  DataGridColumn,
  EditableInputProps,
} from "../types/columns";

interface EditableTextCellProps<TData, TValue>
  extends EditableInputProps<TData, TValue> {
  col: DataGridColumn<TData, TValue>;
}

export function EditableTextCell<TData, TValue>({
  value: initialValue,
  row,
  rowId,
  accessorKey,
  onChange,
  col,
}: EditableTextCellProps<TData, TValue>) {
  const inputType: ColumnInputType = col.inputType ?? "text";
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onCommit = (newValue: unknown) => {
    setValue(newValue as TValue);
    onChange(newValue as TValue);
  };

  const asString = (nextValue: unknown): string =>
    nextValue === null || nextValue === undefined ? "" : String(nextValue);

  const asDateOrNull = (nextValue: unknown): Date | null => {
    if (!nextValue) return null;
    return nextValue instanceof Date ? nextValue : new Date(String(nextValue));
  };

  switch (inputType) {
    case "text":
      return (
        <Input
          className="h-8 w-full min-w-[100px] border border-border"
          value={asString(value)}
          onChange={(event) => setValue(event.target.value as unknown as TValue)}
          onBlur={() => onCommit(value)}
        />
      );
    case "number":
      return (
        <Input
          type="number"
          className="h-8 w-full min-w-[80px]"
          value={asString(value)}
          onChange={(event) => setValue(event.target.value as unknown as TValue)}
          onBlur={() => onCommit(value)}
        />
      );
    case "select":
      return (
        <SelectOptionCell
          value={value}
          options={col.selectOptions ?? []}
          onChange={onCommit}
        />
      );
    case "datepicker":
      return (
        <DateCell
          value={asDateOrNull(value)}
          onChange={onCommit}
          dateFormat={col.dateFormat}
        />
      );
    case "badge":
      return <StatusBadgeCell value={value} variant={col.badgeVariant} />;
    case "custom":
      if (col.cellRenderInput) {
        return col.cellRenderInput({
          value,
          row,
          rowId,
          accessorKey,
          onChange: onCommit,
        });
      }
      return <span>{asString(value)}</span>;
    default:
      return <span>{asString(value)}</span>;
  }
}

/** @deprecated Use EditableTextCell instead. */
export const EditableCell = EditableTextCell;
