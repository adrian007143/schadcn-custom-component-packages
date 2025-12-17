"use client"

import * as React from "react"
import { CalendarDays } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  value?: Date | string
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  inputClassName?: string // NEW: Specific input styling
  disabled?: boolean
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  className,
  inputClassName, // NEW: Accept input-specific classes
  disabled = false,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState(
    value ? (typeof value === 'string' ? value : format(value, "MM/dd/yyyy")) : ""
  )

  // ✅ Single parser: MMDDYYYY or MM/DD/YYYY
  function parseDate(input: string): Date | undefined {
    const digits = input.replace(/\D/g, "")
    if (digits.length === 8) {
      const mm = parseInt(digits.slice(0, 2), 10)
      const dd = parseInt(digits.slice(2, 4), 10)
      const yyyy = parseInt(digits.slice(4, 8), 10)
      if (mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) {
        const date = new Date(yyyy, mm - 1, dd)
        return isNaN(date.getTime()) ? undefined : date
      }
    }
    return undefined
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setInputValue(val)

    if (val.trim() === "") {
      // if cleared, keep it empty
      onChange?.(undefined)
      return
    }

    const parsed = parseDate(val)
    if (parsed) {
      onChange?.(parsed)
    }
  }

  function handleBlur() {
    if (inputValue.trim() === "") {
      return // leave it empty
    }

    const parsed = parseDate(inputValue)
    if (parsed) {
      setInputValue(format(parsed, "MM/dd/yyyy"))
    } else if (value) {
      // if invalid, fallback to last valid value
      if (typeof value === 'string') {
        setInputValue(value)
      } else {
        setInputValue(format(value, "MM/dd/yyyy"))
      }
    } else {
      // otherwise clear it
      setInputValue("")
    }
  }

  // NEW: Handle input click to open calendar
  const handleInputClick = () => {
    if (!disabled) {
      setOpen(true)
    }
  }

  return (
    <div className={cn("flex w-full items-center relative", className)}>
      <Input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onClick={handleInputClick} // NEW: Click to open calendar
        disabled={disabled}
        className={cn(
          "font-normal pr-10 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent w-full rounded-none cursor-pointer", // ADDED: cursor-pointer
          inputClassName // NEW: Apply input-specific classes
        )}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className="absolute right-0 top-0">
          <Button
            type="button"
            variant="ghost"
            disabled={disabled}
            className={cn(
              "h-full px-3 hover:bg-transparent focus:bg-transparent active:bg-transparent",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <CalendarDays className="h-auto w-4 opacity-70" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={parseDate(inputValue) ?? (typeof value === 'string' ? parseDate(value) : value)}
            captionLayout="dropdown"
            onSelect={(date) => {
              if (date) {
                onChange?.(date)
                setInputValue(format(date, "MM/dd/yyyy"))
              }
              setOpen(false)
            }}
            className="border-0"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}