"use client"

import { Badge } from "@/components/ui/badge"

interface BadgeCellProps {
  value: unknown
  variant?: "default" | "secondary" | "outline" | "destructive"
}

export function BadgeCell({
  value,
  variant = "outline",
}: BadgeCellProps) {
  return <Badge variant={variant}>{String(value ?? "")}</Badge>
}
