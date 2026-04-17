"use client";

import * as React from "react";
import type { Table } from "@tanstack/react-table";
import {
  CheckIcon,
  ChevronDownIcon,
  ColumnsIcon,
  DownloadIcon,
  PlusIcon,
  RotateCcwIcon,
  SaveIcon,
  Trash2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

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

const VIEW_MODES: { value: ViewMode; label: string }[] = [
  { value: "compact", label: "Compact" },
  { value: "comfortable", label: "Comfortable" },
  { value: "spacious", label: "Spacious" },
];

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
  const activeFilters = table.getState().columnFilters.length;

  React.useEffect(() => {
    setValue(globalFilter);
  }, [globalFilter]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onGlobalFilterChange(value);
    }, 300);
    return () => clearTimeout(timeout);
  }, [value, onGlobalFilterChange]);

  const handleResetFilters = () => {
    setValue("");
    onGlobalFilterChange("");
    table.resetColumnFilters();
  };

  return (
    <div className="flex flex-col gap-3 px-2 py-3 sm:px-4">
      {/* ── Title row ─────────────────────────────────────────── */}
      {(title || subtitle) && (
        <div className="space-y-0.5">
          {title && (
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      )}

      {/* ── Controls row ─────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Left: search + filters */}
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {enableGlobalFilter && (
            <SearchInput
              placeholder="Search…"
              value={value}
              onChange={(e) => setValue(e.target.value)}
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

          {/* Reset all filters — visible when any filter is active */}
          {(activeFilters > 0 || value) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="h-9 gap-1.5 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <RotateCcwIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          )}
        </div>

        {/* Right: action buttons */}
        <div className="flex items-center gap-1.5">
          {/* Bulk delete — only when rows are selected */}
          {onDeleteSelected && selectedCount > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onDeleteSelected}
              className="h-9 gap-1.5 animate-in fade-in zoom-in"
            >
              <Trash2Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                Delete {selectedCount > 1 ? `(${selectedCount})` : ""}
              </span>
            </Button>
          )}

          {/* Save changes — only when unsaved edits exist */}
          {onSave && hasChanges && (
            <Button
              size="sm"
              onClick={onSave}
              className="h-9 gap-1.5 animate-in fade-in zoom-in"
            >
              <SaveIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Save changes</span>
            </Button>
          )}

          <Separator orientation="vertical" className="mx-0.5 h-5" />

          {/* Export */}
          {onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="h-9 gap-1.5 border-border/70 bg-background shadow-sm hover:border-border hover:bg-muted/40"
              title="Export CSV"
            >
              <DownloadIcon className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">Export</span>
            </Button>
          )}

          {/* Column visibility */}
          {enableColumnVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 gap-1.5 border-border/70 bg-background shadow-sm hover:border-border hover:bg-muted/40"
                  title="Toggle columns"
                >
                  <ColumnsIcon className="h-3.5 w-3.5" />
                  <span className="hidden lg:inline">Columns</span>
                  <ChevronDownIcon className="h-3 w-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Toggle columns
                  </DropdownMenuLabel>
                  {table
                    .getAllLeafColumns()
                    .filter(
                      (col) =>
                        typeof col.accessorFn !== "undefined" && col.getCanHide()
                    )
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize text-sm"
                        checked={column.getIsVisible()}
                        onCheckedChange={(val) => column.toggleVisibility(!!val)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Row density
                  </DropdownMenuLabel>
                  {VIEW_MODES.map((mode) => (
                    <DropdownMenuItem
                      key={mode.value}
                      className={cn(
                        "gap-2 text-sm",
                        viewMode === mode.value && "font-medium text-primary"
                      )}
                      onClick={() => onViewModeChange(mode.value)}
                    >
                      {viewMode === mode.value && (
                        <CheckIcon className="h-3.5 w-3.5" />
                      )}
                      <span className={cn(viewMode !== mode.value && "pl-5")}>
                        {mode.label}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Add row */}
          {onAddRow && (
            <Button
              size="sm"
              onClick={onAddRow}
              className="h-9 gap-1.5"
            >
              <PlusIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Add</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/** @deprecated Use DataGridToolbar instead. */
export const TableToolbar = DataGridToolbar;
