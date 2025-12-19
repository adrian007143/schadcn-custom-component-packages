"use client"

import { Button } from "@/components/ui/button"
import { GripVerticalIcon } from "lucide-react"
import { useRowDrag } from "./row-drag-context"

export function DragHandle() {
  const { attributes, listeners, isDragging } = useRowDrag()

  // Only render if listeners exist (i.e., we are inside a draggable row)
  if (!listeners) {
    return null
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
        opacity: isDragging ? 0.5 : 1 
      }}
    >
      <GripVerticalIcon className="size-4" />
      <span className="sr-only">Drag row</span>
    </Button>
  )
}