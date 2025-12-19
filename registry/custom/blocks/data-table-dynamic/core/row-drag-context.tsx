"use client"

import * as React from "react"
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities"

interface RowDragContextType {
  attributes: React.HTMLAttributes<HTMLElement>
  listeners: SyntheticListenerMap | undefined
  isDragging: boolean
}

const RowDragContext = React.createContext<RowDragContextType>({
  attributes: {},
  listeners: undefined,
  isDragging: false,
})

export function useRowDrag() {
  return React.useContext(RowDragContext)
}

export const RowDragProvider = RowDragContext.Provider