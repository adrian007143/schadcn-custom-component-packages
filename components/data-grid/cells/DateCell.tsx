"use client";

import * as React from "react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateCellProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  dateFormat?: string;
}

export function DateCell({
  value,
  onChange,
  dateFormat = "yyyy-MM-dd",
}: DateCellProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 w-32 justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          {value ? format(value, dateFormat) : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value ?? undefined}
          onSelect={(date) => {
            onChange(date ?? null);
            setOpen(false);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

/** @deprecated Use DateCell instead. */
export const DatepickerCell = DateCell;
