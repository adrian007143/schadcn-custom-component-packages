"use client";

import { cn } from "@/lib/utils";

export function FormLayout({
  children,
  className,
}: {
  children: React.ReactNode;
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
