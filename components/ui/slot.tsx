import * as React from "react"

// Minimal Slot implementation — replaces @radix-ui/react-slot.
// Merges props from the Slot onto the single React child element.
// Used by Button, Badge, FormControl, and Sidebar components for the `asChild` pattern.

type SlotProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode
}

function mergeSlotProps(
  slotProps: Record<string, unknown>,
  childProps: Record<string, unknown>
): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...slotProps }

  for (const key in childProps) {
    const slotVal = slotProps[key]
    const childVal = childProps[key]

    if (key === "className") {
      merged[key] = [slotVal, childVal].filter(Boolean).join(" ")
    } else if (key === "style") {
      merged[key] = { ...(slotVal as object | undefined), ...(childVal as object | undefined) }
    } else if (typeof slotVal === "function" && typeof childVal === "function") {
      merged[key] = (...args: unknown[]) => {
        ;(childVal as (...a: unknown[]) => unknown)(...args)
        ;(slotVal as (...a: unknown[]) => unknown)(...args)
      }
    } else {
      // Child props take precedence over Slot props (mirrors Radix behaviour)
      merged[key] = childVal !== undefined ? childVal : slotVal
    }
  }

  return merged
}

const Slot = React.forwardRef<HTMLElement, SlotProps>(
  ({ children, ...slotProps }, forwardedRef) => {
    if (React.isValidElement(children)) {
      const childProps = (children.props ?? {}) as Record<string, unknown>
      const merged = mergeSlotProps(
        slotProps as Record<string, unknown>,
        childProps
      )
      return React.cloneElement(children, {
        ...merged,
        ref: forwardedRef ?? (children as { ref?: React.Ref<unknown> }).ref,
      } as React.HTMLAttributes<HTMLElement>)
    }

    if (React.Children.count(children) > 1) {
      React.Children.only(null) // throws with helpful message
    }

    return null
  }
)
Slot.displayName = "Slot"

export { Slot }
