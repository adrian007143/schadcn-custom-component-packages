"use client";

import * as React from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { flexRender, type Cell, type Row } from "@tanstack/react-table";

import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { RowDragProvider } from "./row-drag-context";

interface SortableRowProps<TData> {
  row: Row<TData>;
  densityClass: string;
}

function SortableRowComponent<TData>({
  row,
  densityClass,
}: SortableRowProps<TData>) {
  const { transform, transition, setNodeRef, isDragging, attributes, listeners } =
    useSortable({
      id: row.id,
    });

  const filteredAttributes = React.useMemo(() => {
    return Object.fromEntries(
      Object.entries(attributes).filter(([key]) => key !== "aria-describedby")
    );
  }, [attributes]);

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: "relative",
  };

  const contextValue = React.useMemo(
    () => ({ attributes: filteredAttributes, listeners, isDragging }),
    [filteredAttributes, listeners, isDragging]
  );

  return (
    <RowDragProvider value={contextValue}>
      <TableRow
        ref={setNodeRef}
        data-state={row.getIsSelected() && "selected"}
        data-dragging={isDragging}
        className={cn(
          "data-[dragging=true]:bg-muted/50 data-[dragging=true]:opacity-50",
          densityClass
        )}
        style={style}
      >
        {row.getVisibleCells().map((cell: Cell<TData, unknown>) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    </RowDragProvider>
  );
}

function arePropsEqual<TData>(
  prev: SortableRowProps<TData>,
  next: SortableRowProps<TData>
) {
  if (prev.densityClass !== next.densityClass) return false;
  if (prev.row.original !== next.row.original) return false;
  if (prev.row.getIsSelected() !== next.row.getIsSelected()) return false;
  return true;
}

export const SortableRow = React.memo(
  SortableRowComponent,
  arePropsEqual
) as typeof SortableRowComponent;

/** @deprecated Use SortableRow instead. */
export const DraggableRow = SortableRow;
