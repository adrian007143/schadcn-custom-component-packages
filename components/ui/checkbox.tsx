"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@base-ui-components/react/checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type CheckboxProps = Omit<
  React.ComponentProps<typeof CheckboxPrimitive.Checkbox.Root>,
  "checked" | "defaultChecked" | "onCheckedChange" | "indeterminate"
> & {
  checked?: boolean | "indeterminate"
  defaultChecked?: boolean | "indeterminate"
  onCheckedChange?: (checked: boolean | "indeterminate") => void
}

function Checkbox({
  className,
  checked,
  defaultChecked,
  onCheckedChange,
  ...props
}: CheckboxProps) {
  const isChecked = checked === "indeterminate" ? false : checked
  const isDefaultChecked =
    defaultChecked === "indeterminate" ? false : defaultChecked
  const isIndeterminate =
    checked === "indeterminate" || defaultChecked === "indeterminate"

  return (
    <CheckboxPrimitive.Checkbox.Root
      data-slot="checkbox"
      checked={isChecked}
      defaultChecked={isDefaultChecked}
      indeterminate={isIndeterminate}
      onCheckedChange={(nextChecked) => onCheckedChange?.(nextChecked)}
      className={cn(
        "peer border-input dark:bg-input/30 data-[checked]:bg-primary data-[checked]:text-primary-foreground dark:data-[checked]:bg-primary data-[checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Checkbox.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Checkbox.Indicator>
    </CheckboxPrimitive.Checkbox.Root>
  )
}

export { Checkbox }
