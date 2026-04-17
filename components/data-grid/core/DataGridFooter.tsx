"use client";

import type { Table } from "@tanstack/react-table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface DataGridFooterProps<TData> {
  table: Table<TData>;
}

const PAGE_SIZES = [5, 10, 20, 30, 50];

export function DataGridFooter<TData>({ table }: DataGridFooterProps<TData>) {
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const totalCount = table.getFilteredRowModel().rows.length;
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount() || 1;

  return (
    <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      {/* Left: selection info */}
      <p className="hidden shrink-0 sm:block">
        {selectedCount > 0 ? (
          <span>
            <span className="font-medium text-foreground">{selectedCount}</span>
            {" of "}
            <span className="font-medium text-foreground">{totalCount}</span>
            {" row(s) selected"}
          </span>
        ) : (
          <span>
            <span className="font-medium text-foreground">{totalCount}</span>
            {" row(s) total"}
          </span>
        )}
      </p>

      {/* Right: page size + navigation */}
      <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="hidden whitespace-nowrap sm:block">Rows per page</span>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(v) => table.setPageSize(Number(v))}
          >
            <SelectTrigger className="h-8 w-16 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {PAGE_SIZES.map((size) => (
                <SelectItem key={size} value={`${size}`} className="text-xs">
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page counter */}
        <span className="whitespace-nowrap tabular-nums">
          Page{" "}
          <span className="font-medium text-foreground">{currentPage}</span>
          {" / "}
          <span className="font-medium text-foreground">{totalPages}</span>
        </span>

        {/* Navigation buttons */}
        <div className="flex items-center gap-1">
          {(
            [
              {
                onClick: () => table.setPageIndex(0),
                disabled: !table.getCanPreviousPage(),
                icon: <ChevronsLeftIcon className="h-3.5 w-3.5" />,
                label: "First page",
                className: "hidden sm:flex",
              },
              {
                onClick: () => table.previousPage(),
                disabled: !table.getCanPreviousPage(),
                icon: <ChevronLeftIcon className="h-3.5 w-3.5" />,
                label: "Previous page",
                className: "",
              },
              {
                onClick: () => table.nextPage(),
                disabled: !table.getCanNextPage(),
                icon: <ChevronRightIcon className="h-3.5 w-3.5" />,
                label: "Next page",
                className: "",
              },
              {
                onClick: () => table.setPageIndex(table.getPageCount() - 1),
                disabled: !table.getCanNextPage(),
                icon: <ChevronsRightIcon className="h-3.5 w-3.5" />,
                label: "Last page",
                className: "hidden sm:flex",
              },
            ] as const
          ).map((btn, i) => (
            <Button
              key={i}
              variant="outline"
              size="icon"
              className={cn(
                "h-8 w-8 border-border/70 bg-background shadow-sm transition-colors hover:border-border hover:bg-muted/40 disabled:opacity-40",
                btn.className
              )}
              onClick={btn.onClick}
              disabled={btn.disabled}
            >
              <span className="sr-only">{btn.label}</span>
              {btn.icon}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

/** @deprecated Use DataGridFooter instead. */
export const TableFooter = DataGridFooter;
