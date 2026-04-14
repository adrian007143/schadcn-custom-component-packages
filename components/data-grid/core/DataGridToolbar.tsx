"use client";

import * as React from "react";
import type { Table } from "@tanstack/react-table";
import {
  CheckIcon,
  ChevronDownIcon,
  DownloadIcon,
  PlusIcon,
  SaveIcon,
  Settings2Icon,
  Trash2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DataGridFilter } from "./DataGridFilter";
import { SearchInput } from "../inputs/search-input";
import { DataGridColumn } from "../types/columns";
import { ViewMode } from "../types/table";

interface DataGridToolbarProps<TData> {
  table: Table<TData>;
  columnConfig: DataGridColumn<TData, unknown>[];
  enableGlobalFilter?: boolean;
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  enableColumnVisibility?: boolean;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  title?: string;
  subtitle?: string;
  onAddRow?: () => void;
  onSave?: () => void;
  onDeleteSelected?: () => void;
  onExport?: () => void;
  hasChanges?: boolean;
}

export function DataGridToolbar<TData>({
  table,
  columnConfig,
  enableGlobalFilter,
  globalFilter,
  onGlobalFilterChange,
  enableColumnVisibility,
  viewMode,
  onViewModeChange,
  title,
  subtitle,
  onAddRow,
  onSave,
  onDeleteSelected,
  onExport,
  hasChanges = false,
}: DataGridToolbarProps<TData>) {
  const [value, setValue] = React.useState(globalFilter);
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  React.useEffect(() => {
    setValue(globalFilter);
  }, [globalFilter]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onGlobalFilterChange(value);
    }, 300);
    return () => clearTimeout(timeout);
  }, [value, onGlobalFilterChange]);

  return (
    <div className="flex flex-col justify-between gap-4 px-2 py-4 sm:flex-row sm:items-end sm:px-4">
      <div className="flex flex-1 flex-col gap-4">
        {(title || subtitle) && (
          <div className="space-y-1">
            {title && <h2 className="text-xl font-bold tracking-tight">{title}</h2>}
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {enableGlobalFilter && (
            <SearchInput
              placeholder="Search..."
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onClear={() => setValue("")}
            />
          )}

          {columnConfig.map((col) => {
            if (!col.filterOptions || !col.accessorKey) return null;
            const colId = col.id || col.accessorKey;
            const column = table.getColumn(colId);

            if (!column) return null;

            return (
              <DataGridFilter
                key={String(colId)}
                column={column}
                title={String(col.header)}
                options={col.filterOptions}
              />
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {onDeleteSelected && selectedCount > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onDeleteSelected}
            className="h-9 gap-1 shadow-sm"
          >
            <Trash2Icon className="size-3.5" />
            <span className="hidden sm:inline">Delete ({selectedCount})</span>
          </Button>
        )}

        {onSave && hasChanges && (
          <Button
            variant="default"
            size="sm"
            onClick={onSave}
            className="h-9 gap-1 animate-in zoom-in fade-in"
          >
            <SaveIcon className="size-3.5" />
            <span className="hidden sm:inline">Save</span>
          </Button>
        )}

        {onExport && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="h-9 gap-1 shadow-sm"
          >
            <DownloadIcon className="size-3.5" />
            <span className="hidden lg:inline">Export</span>
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1 shadow-sm">
              <Settings2Icon className="size-3.5" />
              <span className="hidden lg:inline">View</span>
              <ChevronDownIcon className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Table Density</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onViewModeChange("compact")}>
              {viewMode === "compact" && <CheckIcon className="mr-1 size-3.5" />}
              Compact
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewModeChange("comfortable")}>
              {viewMode === "comfortable" && (
                <CheckIcon className="mr-1 size-3.5" />
              )}
              Comfortable
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewModeChange("spacious")}>
              {viewMode === "spacious" && (
                <CheckIcon className="mr-1 size-3.5" />
              )}
              Spacious
            </DropdownMenuItem>

            {enableColumnVisibility && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                {table
                  .getAllLeafColumns()
                  .filter(
                    (col) =>
                      typeof col.accessorFn !== "undefined" && col.getCanHide()
                  )
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(val) => column.toggleVisibility(!!val)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {onAddRow && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAddRow}
            className="h-9 gap-1 shadow-sm"
          >
            <PlusIcon className="size-3.5" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        )}
      </div>
    </div>
  );
}

/** @deprecated Use DataGridToolbar instead. */
export const TableToolbar = DataGridToolbar;
