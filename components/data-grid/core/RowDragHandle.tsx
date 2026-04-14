"use client";

import { GripVerticalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useRowDrag } from "./row-drag-context";

export function RowDragHandle() {
  const { attributes, listeners, isDragging } = useRowDrag();

  if (!listeners) {
    return null;
  }

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="h-8 w-8 cursor-grab text-muted-foreground hover:bg-transparent active:cursor-grabbing"
      style={{
        cursor: isDragging ? "grabbing" : "grab",
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <GripVerticalIcon className="size-4" />
      <span className="sr-only">Drag row</span>
    </Button>
  );
}

/** @deprecated Use RowDragHandle instead. */
export const DragHandle = RowDragHandle;
