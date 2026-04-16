"use client"

import * as React from "react"
import {
  CheckIcon,
  ChevronsUpDownIcon,
  SearchIcon,
  XIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface MultiSelectOption {
  label: string
  value: string
  disabled?: boolean
}

interface MultiSelectProps {
  value?: string[]
  onChange?: (value: string[]) => void
  options: MultiSelectOption[]
  placeholder?: string
  disabled?: boolean
  maxSelected?: number
  inputId?: string
  ariaInvalid?: boolean
  ariaDescribedBy?: string
  className?: string
}

function MultiSelect({
  value = [],
  onChange,
  options,
  placeholder = "Select options",
  disabled,
  maxSelected,
  inputId,
  ariaInvalid,
  ariaDescribedBy,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [contentWidth, setContentWidth] = React.useState<number>()

  const selectedItems = React.useMemo(
    () => options.filter((option) => value.includes(option.value)),
    [options, value],
  )

  const filteredOptions = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) {
      return options
    }

    return options.filter((option) =>
      option.label.toLowerCase().includes(normalizedQuery),
    )
  }, [options, query])

  React.useLayoutEffect(() => {
    if (!triggerRef.current) return

    const updateWidth = () => {
      setContentWidth(triggerRef.current?.getBoundingClientRect().width)
    }

    updateWidth()

    const resizeObserver = new ResizeObserver(updateWidth)
    resizeObserver.observe(triggerRef.current)

    return () => resizeObserver.disconnect()
  }, [])

  React.useEffect(() => {
    if (!open) {
      setQuery("")
      return
    }

    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus({ preventScroll: true })
    })

    return () => cancelAnimationFrame(frame)
  }, [open])

  const toggleValue = React.useCallback(
    (nextValue: string) => {
      const exists = value.includes(nextValue)

      if (exists) {
        onChange?.(value.filter((item) => item !== nextValue))
        return
      }

      if (maxSelected && value.length >= maxSelected) {
        return
      }

      onChange?.([...value, nextValue])
    },
    [maxSelected, onChange, value],
  )

  const removeValue = React.useCallback(
    (nextValue: string) => {
      onChange?.(value.filter((item) => item !== nextValue))
    },
    [onChange, value],
  )

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) {
          setQuery("")
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          id={inputId}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
          disabled={disabled}
          className={cn(
            "border-0 bg-transparent px-0 py-0 text-left shadow-none hover:bg-transparent focus-visible:ring-0",
            "flex h-full w-full items-center justify-between gap-2",
            className,
          )}
        >
          <div className="flex min-h-9 flex-1 flex-wrap items-center gap-1.5 py-1">
            {selectedItems.length ? (
              selectedItems.map((item) => (
                <Badge
                  key={item.value}
                  variant="secondary"
                  className="flex items-center gap-1 rounded-md px-2 py-0.5"
                >
                  <span className="max-w-32 truncate">{item.label}</span>
                  <span
                    role="button"
                    tabIndex={0}
                    className="cursor-pointer rounded-full outline-none"
                    onClick={(event) => {
                      event.stopPropagation()
                      removeValue(item.value)
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        event.stopPropagation()
                        removeValue(item.value)
                      }
                    }}
                  >
                    <XIcon className="size-3" />
                    <span className="sr-only">Remove {item.label}</span>
                  </span>
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground text-sm">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDownIcon className="text-muted-foreground size-4 shrink-0 opacity-70" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        initialFocus={false}
        side="bottom"
        align="start"
        sideOffset={4}
        className="min-w-64 p-0"
        style={contentWidth ? { width: `${contentWidth}px` } : undefined}
      >
        <div className="bg-background overflow-hidden rounded-md">
          <div className="flex items-center gap-2 border-b px-3">
            <SearchIcon className="size-4 shrink-0 opacity-50" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search options..."
              className="h-10 rounded-none border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            />
          </div>

          <div className="max-h-64 overflow-y-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                No options found.
              </div>
            ) : (
              filteredOptions.map((option) => {
                const checked = value.includes(option.value)
                const selectionLimitReached =
                  !checked && !!maxSelected && value.length >= maxSelected

                return (
                  <button
                    key={option.value}
                    type="button"
                    disabled={option.disabled || selectionLimitReached}
                    onClick={() => toggleValue(option.value)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      checked && "bg-accent text-accent-foreground",
                      (option.disabled || selectionLimitReached) &&
                        "pointer-events-none opacity-50",
                    )}
                  >
                    <span
                      className={cn(
                        "border-input flex size-4 shrink-0 items-center justify-center rounded-sm border",
                        checked &&
                          "bg-primary border-primary text-primary-foreground",
                      )}
                    >
                      {checked ? <CheckIcon className="size-3" /> : null}
                    </span>
                    <span className="flex-1 truncate">{option.label}</span>
                  </button>
                )
              })
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { MultiSelect }
