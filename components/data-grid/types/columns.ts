import type { ColumnDef } from "@tanstack/react-table";
import type { ReactNode } from "react";

export type DisplayMode = "avatar" | "rounded" | "square";
export type ImageSize = "sm" | "md" | "lg" | "xl";

export type ColumnInputType =
  | "text"
  | "number"
  | "select"
  | "datepicker"
  | "badge"
  | "custom"
  | "none";

export interface EditableInputProps<TData, TValue> {
  value: TValue;
  row: TData;
  rowId: string | number;
  accessorKey: keyof TData & string;
  onChange: (value: TValue) => void;
}

export type DataGridColumn<TData, TValue = unknown> = ColumnDef<TData, TValue> & {
  accessorKey: (keyof TData & string) | (string & {});
  displayMode?: DisplayMode;
  imageSize?: ImageSize;
  imageAltKey?: keyof TData & string;
  editable?: boolean;
  inputType?: ColumnInputType;
  selectOptions?: { label: string; value: unknown }[];
  badgeVariant?: "default" | "secondary" | "outline" | "destructive";
  filterOptions?: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  dateFormat?: string;
  cellRenderInput?: (props: EditableInputProps<TData, TValue>) => ReactNode;
};

/** @deprecated Use DataGridColumn instead. */
export type DynamicColumnDef<TData, TValue = unknown> = DataGridColumn<
  TData,
  TValue
>;
