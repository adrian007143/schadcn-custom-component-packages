"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";

interface AvatarCellProps<TData extends Record<string, unknown>> {
  row: TData;
  imageKey: keyof TData & string;
  altKey?: keyof TData & string;
  displayMode?: "avatar" | "rounded" | "square";
  imageSize?: "sm" | "md" | "lg" | "xl";
}

const IMAGE_SIZE_CLASS = {
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
  xl: "size-16",
} as const;

export function AvatarCell<TData extends Record<string, unknown>>({
  row,
  imageKey,
  altKey,
  displayMode = "avatar",
  imageSize = "md",
}: AvatarCellProps<TData>) {
  const imageSrc = row[imageKey];
  const altText = altKey ? row[altKey] : undefined;
  const shapeClass =
    displayMode === "square"
      ? "rounded-md"
      : displayMode === "rounded"
      ? "rounded-xl"
      : "rounded-full";

  return (
    <Avatar className={cn(IMAGE_SIZE_CLASS[imageSize], shapeClass)}>
      <AvatarImage src={String(imageSrc ?? "")} alt={String(altText ?? "")} />
      <AvatarFallback>{String(altText ?? "?").slice(0, 2)}</AvatarFallback>
    </Avatar>
  );
}

/** @deprecated Use AvatarCell instead. */
export const ImageCell = AvatarCell;
