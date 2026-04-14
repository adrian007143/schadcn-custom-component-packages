"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function FormLayout({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "space-y-10",
        className
      )}
    >
      {children}
    </div>
  );
}
