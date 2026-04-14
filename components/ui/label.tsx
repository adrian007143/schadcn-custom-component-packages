"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

// No Base UI equivalent for a standalone Label — using a plain <label> element.
// API is identical to the previous @radix-ui/react-label wrapper.

function Label({
  className,
  ...props
}: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }
