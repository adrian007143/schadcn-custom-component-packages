"use client";

import * as React from "react";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form";

interface SelectInputProps<T extends Record<string, unknown>> {
  field: {
    value: unknown;
    onChange: (value: unknown) => void;
  };
  data: readonly T[];
  label: string;
  placeholder?: string;
  disabled?: boolean;
  labelKey: keyof T; // which key to display
  valueKey: keyof T; // which key to store
  className?: string;
}

export function SelectInput<T extends Record<string, unknown>>({
  field,
  data,
  label,
  placeholder,
  disabled,
  labelKey,
  valueKey,
  className,
}: SelectInputProps<T>) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [popoverWidth, setPopoverWidth] = React.useState<number | undefined>(undefined);

  const selectedItem = data.find((item) => item[valueKey] === field.value);

  // Update popover width when trigger ref is available
  React.useEffect(() => {
    if (triggerRef.current) {
      const width = triggerRef.current.offsetWidth;
      setPopoverWidth(width);
    }
  }, [open]); // Re-calculate when popover opens

  return (
    <FormControl>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            variant="outline"
            role="combobox"
            disabled={disabled}
            className={cn(
              "w-full justify-between border border-input bg-background shadow-sm hover:bg-input hover:text-accent-foreground transition-colors duration-200",
              "text-left font-normal",
              !field.value && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed",
              className
            )}
          >
            <span className="truncate">
              {selectedItem
                ? String(selectedItem[labelKey])
                : placeholder || `Select ${label}`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-60" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 border border-border shadow-md"
          style={{ width: popoverWidth ? `${popoverWidth}px` : undefined }}
          side="bottom"
          align="start"
          sideOffset={4}
        >
          <Command className="border-0">
            <CommandInput
              placeholder={`Search ${label.toLowerCase()}...`}
              className="h-full border-b border-border"
            />
            <CommandList className="max-h-64">
              <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                No {label} found.
              </CommandEmpty>
              <CommandGroup className="p-1">
                {data.map((item) => (
                  <CommandItem
                    key={String(item[valueKey])}
                    value={String(item[labelKey])}
                    onSelect={() => {
                      field.onChange(item[valueKey]);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 text-sm rounded-sm transition-colors duration-150",
                      "aria-selected:bg-accent/20 aria-selected:text-accent-foreground",
                      "hover:bg-accent/20 hover:text-accent-foreground cursor-pointer"
                    )}
                  >
                    <span className="truncate">{String(item[labelKey])}</span>
                    <Check
                      className={cn(
                        "ml-2 h-4 w-4 shrink-0 transition-opacity duration-200",
                        item[valueKey] === field.value
                          ? "opacity-100 text-primary"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </FormControl>
  );
}