"use client";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Base shimmer skeleton for form fields.
 * Height must be supplied externally via className="h-10"
 */
export function FieldSkeletonLoader({
  rounded = "rounded-md",
  className,
}: {
  rounded?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        rounded,
        className
      )}
    >
      <Skeleton className="w-full h-full" />

      <div
        className={cn(
          "absolute inset-0 -translate-x-full",
          "animate-[shimmer_1.6s_infinite]",
          "bg-linear-to-r from-transparent via-white/40 to-transparent"
        )}
      />
    </div>
  );
}
