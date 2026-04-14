"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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

  const selectedItems = React.useMemo(
    () => options.filter((option) => value.includes(option.value)),
    [options, value]
  )

  const filteredOptions = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) {
      return options
    }

    return options.filter((option) =>
      option.label.toLowerCase().includes(normalizedQuery)
    )
  }, [options, query])

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
    [maxSelected, onChange, value]
  )

  const removeValue = React.useCallback(
    (nextValue: string) => {
      onChange?.(value.filter((item) => item !== nextValue))
    },
    [onChange, value]
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
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
              className
            )}
          />
        }
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
                  className="rounded-full outline-none cursor-pointer"
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
      </PopoverTrigger>
      <PopoverContent className="w-[var(--anchor-width)] min-w-64 p-0">
        <Command shouldFilter={false}>
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder="Search options..."
          />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => {
                const checked = value.includes(option.value)
                const selectionLimitReached =
                  !checked && !!maxSelected && value.length >= maxSelected

                return (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    disabled={option.disabled || selectionLimitReached}
                    onSelect={() => toggleValue(option.value)}
                    className="flex items-center gap-2"
                  >
                    <span
                      className={cn(
                        "border-input flex size-4 shrink-0 items-center justify-center rounded-sm border",
                        checked && "bg-primary border-primary text-primary-foreground"
                      )}
                    >
                      {checked ? <CheckIcon className="size-3" /> : null}
                    </span>
                    <span className="flex-1 truncate">{option.label}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { MultiSelect }
