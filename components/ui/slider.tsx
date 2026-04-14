"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "@base-ui/react/slider"

import { cn } from "@/lib/utils"

function Slider({
  className,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn(
        "group/slider relative flex w-full touch-none select-none items-center py-2",
        className
      )}
      {...props}
    />
  )
}

function SliderControl({
  className,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Control>) {
  return (
    <SliderPrimitive.Control
      data-slot="slider-control"
      className={cn("relative flex w-full items-center", className)}
      {...props}
    />
  )
}

function SliderTrack({
  className,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Track>) {
  return (
    <SliderPrimitive.Track
      data-slot="slider-track"
      className={cn(
        "bg-muted relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

function SliderIndicator({
  className,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Indicator>) {
  return (
    <SliderPrimitive.Indicator
      data-slot="slider-indicator"
      className={cn("bg-primary absolute h-full rounded-full", className)}
      {...props}
    />
  )
}

function SliderThumb({
  className,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Thumb>) {
  return (
    <SliderPrimitive.Thumb
      data-slot="slider-thumb"
      className={cn(
        "border-primary bg-background ring-ring/50 block size-4 rounded-full border shadow-sm outline-none transition-transform focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function SliderValue({
  className,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Value>) {
  return (
    <SliderPrimitive.Value
      data-slot="slider-value"
      className={cn("text-sm font-medium tabular-nums", className)}
      {...props}
    />
  )
}

export {
  Slider,
  SliderControl,
  SliderTrack,
  SliderIndicator,
  SliderThumb,
  SliderValue,
}
