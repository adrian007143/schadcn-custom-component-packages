"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { XIcon, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

export interface Option {
  value: string | number;
  label: string;
  disable?: boolean;
  fixed?: boolean;
  [key: string]: string | number | boolean | undefined;
}

export interface SingleSelectorProps<
  T extends Record<string, unknown> = Record<string, unknown>
> {
  field: {
    value: unknown;
    onChange: (value: unknown) => void;
  };
  data: readonly T[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  labelKey: string;
  valueKey: string;
  inputId?: string;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
  className?: string;
}

export function SearchSelect<
  T extends Record<string, unknown> = Record<string, unknown>
>({
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
}: SingleSelectorProps<T>) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  // Safely index into T with labelKey / valueKey
  const getLabel = React.useCallback(
    (item: T): string => {
      const key = labelKey as keyof T;
      const raw = item[key];
      return raw == null ? "" : String(raw);
    },
    [labelKey]
  );

  const getValue = React.useCallback(
    (item: T): unknown => {
      const key = valueKey as keyof T;
      return item[key];
    },
    [valueKey]
  );

  // Find the selected item
  const selectedItem = React.useMemo(() => {
    const key = valueKey as keyof T;
    return (
      data.find((item) => item[key] === field.value) ?? null
    );
  }, [data, field.value, valueKey]);

  // Update input value when selected item changes
  React.useEffect(() => {
    if (selectedItem) {
      setInputValue(getLabel(selectedItem));
    } else {
      setInputValue("");
    }
  }, [selectedItem, getLabel]);

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      inputRef.current &&
      !inputRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  };

  React.useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchend", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
    };
  }, [open]);

  const handleUnselect = React.useCallback(() => {
    field.onChange(null);
    setInputValue("");
  }, [field]);

  const handleSelectItem = React.useCallback(
    (item: T) => {
      field.onChange(getValue(item));
      setOpen(false);
    },
    [field, getValue]
  );

  const filteredData = React.useMemo(() => {
    if (!inputValue) return data;

    const lowerInput = inputValue.toLowerCase();
    return data.filter((item) =>
      getLabel(item).toLowerCase().includes(lowerInput)
    );
  }, [data, inputValue, getLabel]);

  return (
    <Command
      ref={dropdownRef}
      className={cn("h-auto overflow-visible bg-transparent")}
    >
      <div
        className={cn(
          "relative flex items-center w-full h-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background",
          "placeholder:text-muted-foreground",
          "disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        onClick={() => {
          if (disabled) return;
          inputRef?.current?.focus();
          setOpen(true);
        }}
      >
        <CommandPrimitive.Input
          ref={inputRef}
          id={inputId}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
          value={inputValue}
          disabled={disabled}
          onValueChange={(value) => {
            setInputValue(value);
          }}
          onBlur={() => {
            if (selectedItem) {
              setInputValue(getLabel(selectedItem));
            }
          }}
          onFocus={() => {
            setOpen(true);
          }}
          placeholder={placeholder || `Select ${label ?? ""}...`}
          className={cn(
            "flex-1 bg-transparent outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed border-0 p-0 focus:outline-none focus:ring-0 text-sm"
          )}
        />

        <div className="ml-2 flex items-center gap-1">
          {selectedItem && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-accent text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                handleUnselect();
              }}
            >
              <XIcon className="h-2.5 w-2.5" />
            </Button>
          )}
          <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        </div>
      </div>

      <div className="relative">
        <div
          className={cn(
            "absolute top-1 z-10 w-full overflow-hidden rounded-md border border-input shadow-md bg-popover",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            !open && "hidden"
          )}
          data-state={open ? "open" : "closed"}
        >
          {open && (
            <CommandList className="outline-hidden max-h-60">
              <CommandEmpty className="py-4 text-center text-sm text-muted-foreground">
                No results found.
              </CommandEmpty>

              <CommandGroup className="h-full overflow-auto">
                {filteredData.map((item) => {
                  const isSelected = getValue(item) === field.value;
                  const itemLabel = getLabel(item);

                  return (
                    <CommandItem
                      key={String(getValue(item))}
                      value={itemLabel}
                      onSelect={() => handleSelectItem(item)}
                      className={cn(
                        "cursor-pointer px-2 py-1.5 text-sm transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        isSelected && "bg-primary/10 text-primary font-medium"
                      )}
                    >
                      <span className="flex-1 truncate">{itemLabel}</span>
                      {isSelected && (
                        <div className="ml-2 flex h-3.5 w-3.5 items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        </div>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          )}
        </div>
      </div>
    </Command>
  );
}

/** @deprecated Use SearchSelect instead. */
export const SingleSelector = SearchSelect;
