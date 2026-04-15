"use client"

import * as React from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface SelectFieldProps<T extends Record<string, unknown>> {
  field: {
    value: unknown
    onChange: (value: unknown) => void
  }
  data: readonly T[]
  label?: string
  placeholder?: string
  disabled?: boolean
  labelKey: keyof T
  valueKey: keyof T
  inputId?: string
  ariaInvalid?: boolean
  ariaDescribedBy?: string
  className?: string
}

export function SelectField<T extends Record<string, unknown>>({
  field,
  data,
  label,
  placeholder,
  disabled,
  labelKey,
  valueKey,
  inputId,
  ariaInvalid,
  ariaDescribedBy,
  className,
}: SelectFieldProps<T>) {
  const EMPTY_VALUE = "__formkitcn_empty__"
  const rootRef = React.useRef<HTMLDivElement>(null)
  const [contentWidth, setContentWidth] = React.useState<number>()

  const selectedItem = React.useMemo(
    () =>
      data.find(
        (item) => String(item[valueKey] ?? "") === String(field.value ?? ""),
      ) ?? null,
    [data, field.value, valueKey],
  )

  const selectedValue = selectedItem
    ? String(selectedItem[valueKey] ?? "")
    : field.value == null || field.value === ""
      ? EMPTY_VALUE
      : String(field.value)

  React.useLayoutEffect(() => {
    if (!rootRef.current) return

    const updateWidth = () => {
      setContentWidth(rootRef.current?.getBoundingClientRect().width)
    }

    updateWidth()

    const resizeObserver = new ResizeObserver(updateWidth)
    resizeObserver.observe(rootRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div ref={rootRef} className="h-full w-full">
      <Select
        value={selectedValue}
        onValueChange={(nextValue) => {
          if (nextValue === EMPTY_VALUE) {
            field.onChange(null)
            return
          }

          const matched = data.find(
            (item) => String(item[valueKey] ?? "") === String(nextValue),
          )

          field.onChange(matched ? matched[valueKey] : nextValue)
        }}
        disabled={disabled}
      >
        <SelectTrigger
          id={inputId}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
          className={cn("h-full w-full justify-between border-input", className)}
        >
          <SelectValue placeholder={placeholder || `Select ${label ?? ""}`} />
        </SelectTrigger>
        <SelectContent
          align="start"
          side="bottom"
          sideOffset={4}
          className="min-w-0 bg-background"
          style={contentWidth ? { width: `${contentWidth}px` } : undefined}
        >
          {data.map((item) => (
            <SelectItem
              key={String(item[valueKey] ?? item[labelKey] ?? "")}
              value={String(item[valueKey] ?? "")}
            >
              {String(item[labelKey] ?? "")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
