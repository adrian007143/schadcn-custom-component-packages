"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?: Date | string;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  inputId?: string;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
}

function parseDate(input: string): Date | undefined {
  const digits = input.replace(/\D/g, "");
  if (digits.length !== 8) {
    return undefined;
  }

  const mm = Number.parseInt(digits.slice(0, 2), 10);
  const dd = Number.parseInt(digits.slice(2, 4), 10);
  const yyyy = Number.parseInt(digits.slice(4, 8), 10);

  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) {
    return undefined;
  }

  const date = new Date(yyyy, mm - 1, dd);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function DateField({
  value,
  onChange,
  placeholder = "Select date",
  className,
  inputClassName,
  disabled = false,
  inputId,
  ariaInvalid,
  ariaDescribedBy,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  React.useEffect(() => {
    if (!value) {
      setInputValue("");
      return;
    }

    setInputValue(typeof value === "string" ? value : format(value, "MM/dd/yyyy"));
  }, [value]);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextValue = event.target.value;
    setInputValue(nextValue);

    if (nextValue.trim() === "") {
      onChange?.(undefined);
      return;
    }

    const parsed = parseDate(nextValue);
    if (parsed) {
      onChange?.(parsed);
    }
  }

  function handleBlur() {
    if (inputValue.trim() === "") {
      return;
    }

    const parsed = parseDate(inputValue);
    if (parsed) {
      setInputValue(format(parsed, "MM/dd/yyyy"));
      return;
    }

    if (!value) {
      setInputValue("");
      return;
    }

    setInputValue(typeof value === "string" ? value : format(value, "MM/dd/yyyy"));
  }

  return (
    <div className={cn("relative flex w-full items-center", className)}>
      <Input
        id={inputId}
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onClick={() => {
          if (!disabled) {
            setOpen(true);
          }
        }}
        disabled={disabled}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
        className={cn(
          "bg-transparent pr-10 text-sm",
          "focus-visible:ring-0 focus-visible:ring-offset-0",
          "placeholder:text-muted-foreground/60",
          inputClassName
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
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            <CalendarDays className="h-auto w-4 opacity-70" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={
              parseDate(inputValue) ??
              (typeof value === "string" ? parseDate(value) : value)
            }
            captionLayout="dropdown"
            onSelect={(date) => {
              if (date) {
                onChange?.(date);
                setInputValue(format(date, "MM/dd/yyyy"));
              }
              setOpen(false);
            }}
            className="border-0"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

/** @deprecated Use DateField instead. */
export const DatePicker = DateField;
