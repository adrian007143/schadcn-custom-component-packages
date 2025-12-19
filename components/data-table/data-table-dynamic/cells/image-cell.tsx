"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { DisplayMode, ImageSize } from "../types/column.types"

function getImageSizeClass(size: ImageSize = "md"): string {
  switch (size) {
    case "sm":
      return "size-7"
    case "lg":
      return "size-12"
    case "xl":
      return "size-16"
    case "md":
    default:
      return "size-9"
  }
}

interface ImageCellProps<TData extends Record<string, unknown>> {
  row: TData
  imageKey: keyof TData & string
  altKey?: keyof TData & string
  displayMode?: DisplayMode
  imageSize?: ImageSize
}

export function ImageCell<TData extends Record<string, unknown>>({
  row,
  imageKey,
  altKey,
  displayMode = "avatar",
  imageSize,
}: ImageCellProps<TData>) {
  const src = (row[imageKey] ?? "") as string
  const alt = (altKey ? (row[altKey] as string | undefined) : undefined) ?? ""
  const sizeClass = getImageSizeClass(imageSize)

  if (displayMode === "avatar") {
    return (
      <Avatar className={sizeClass}>
        <AvatarImage src={src} alt={alt} />
        <AvatarFallback>{alt?.[0] ?? "?"}</AvatarFallback>
      </Avatar>
    )
  }

  const radius =
    displayMode === "rounded"
      ? "rounded-full"
      : displayMode === "square"
        ? "rounded-md"
        : ""

  return (
    <div className={cn("overflow-hidden", sizeClass, radius)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={cn("h-full w-full object-cover", radius)}
      />
    </div>
  )
}
