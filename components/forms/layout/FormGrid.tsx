"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function FormGrid({
  columns = 2,
  children,
}: {
  columns?: 1 | 2 | 3 | 4;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid gap-4",
        columns === 1 && "grid-cols-1",
        columns === 2 && "grid-cols-1 md:grid-cols-2",
        columns === 3 && "grid-cols-1 md:grid-cols-3",
        columns === 4 && "grid-cols-1 md:grid-cols-4"
      )}
    >
      {children}
    </div>
  );
}

/** @deprecated Use FormGrid instead. */
export const FormColumns = FormGrid;
