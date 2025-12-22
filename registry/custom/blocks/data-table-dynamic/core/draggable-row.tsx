"use client"

import * as React from "react"
import { TableCell, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { Cell, Row } from "@tanstack/react-table"
import { flexRender } from "@tanstack/react-table"
import { RowDragProvider } from "./row-drag-context"

interface DraggableRowProps<TData> {
  row: Row<TData>
  densityClass: string
}

function DraggableRowComponent<TData>({
  row,
  densityClass,
}: DraggableRowProps<TData>) {
  const {
    transform,
    transition,
    setNodeRef,
    isDragging,
    attributes,
    listeners,
  } = useSortable({
    id: row.id,
  })

  // Remove the problematic aria-describedby attribute
  const filteredAttributes = React.useMemo(() => {
    return Object.fromEntries(
      Object.entries(attributes).filter(([key]) => key !== "aria-describedby")
    )
  }, [attributes])

  // CSS.Translate is more performant for GPU composition than CSS.Transform
  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: "relative",
  }

  // Memoize context to prevent unnecessary provider updates
  const contextValue = React.useMemo(
    () => ({ attributes: filteredAttributes, listeners, isDragging }),
    [filteredAttributes, listeners, isDragging]
  )

  return (
    <RowDragProvider value={contextValue}>
      <TableRow
        ref={setNodeRef}
        data-state={row.getIsSelected() && "selected"}
        data-dragging={isDragging}
        className={cn(
          "data-[dragging=true]:opacity-50 data-[dragging=true]:bg-muted/50",
          densityClass,
        )}
        style={style}
      >
        {row
          .getVisibleCells()
          .map((cell: Cell<TData, unknown>) => (
            <TableCell key={cell.id}>
              {flexRender(
                cell.column.columnDef.cell,
                cell.getContext(),
              )}
            </TableCell>
          ))}
      </TableRow>
    </RowDragProvider>
  )
}

// Custom Comparator: This prevents the row from re-rendering if its 
// specific data hasn't changed, even if the parent table updates.
function arePropsEqual<TData>(
  prev: DraggableRowProps<TData>,
  next: DraggableRowProps<TData>,
) {
  // 1. Check if density changed
  if (prev.densityClass !== next.densityClass) return false

  // 2. Check if underlying data changed (Referential equality check)
  // This works because we update data immutably in the parent
  if (prev.row.original !== next.row.original) return false

  // 3. Check if selection state changed
  if (prev.row.getIsSelected() !== next.row.getIsSelected()) return false

  // 4. Note: We don't need to check isDragging here because useSortable 
  // inside the component handles that state locally.
  
  return true
}

// Export the Memoized Component
export const DraggableRow = React.memo(
  DraggableRowComponent,
  arePropsEqual,
) as typeof DraggableRowComponent