"use client";

import { Badge } from "@/components/ui/badge";

interface StatusBadgeCellProps {
  value: unknown;
  variant?: "default" | "secondary" | "outline" | "destructive";
}

export function StatusBadgeCell({
  value,
  variant = "outline",
}: StatusBadgeCellProps) {
  return <Badge variant={variant}>{String(value ?? "")}</Badge>;
}

/** @deprecated Use StatusBadgeCell instead. */
export const BadgeCell = StatusBadgeCell;
