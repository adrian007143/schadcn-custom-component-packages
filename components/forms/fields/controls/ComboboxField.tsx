"use client";

import * as React from "react";
import { Check, ChevronsUpDown, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ComboboxFieldProps<T extends Record<string, unknown>> {
  field: {
    value: unknown;
    onChange: (value: unknown) => void;
  };
  data: readonly T[];
  label: string;
  placeholder?: string;
  disabled?: boolean;
  labelKey: keyof T;
  valueKey: keyof T;
  inputId?: string;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
  className?: string;
}

export function ComboboxField<T extends Record<string, unknown>>({
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
}: ComboboxFieldProps<T>) {
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [contentWidth, setContentWidth] = React.useState<number>();

  const selectedItem = React.useMemo(
    () =>
      data.find(
        (item) => String(item[valueKey] ?? "") === String(field.value ?? ""),
      ) ?? null,
    [data, field.value, valueKey],
  );

  const filteredItems = React.useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return data;
    }

    return data.filter((item) =>
      String(item[labelKey] ?? "").toLowerCase().includes(normalized),
    );
  }, [data, labelKey, query]);

  React.useLayoutEffect(() => {
    if (!triggerRef.current) return;

    const updateWidth = () => {
      setContentWidth(triggerRef.current?.getBoundingClientRect().width);
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(triggerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  React.useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }

    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus({ preventScroll: true });
    });

    return () => cancelAnimationFrame(frame);
  }, [open]);

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setQuery("");
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
            "h-full w-full justify-between border-input bg-background px-3 text-left font-normal shadow-none",
            "hover:bg-background focus-visible:ring-0 focus-visible:ring-offset-0",
            !selectedItem && "text-muted-foreground",
            className,
          )}
        >
          <span className="truncate">
            {selectedItem
              ? String(selectedItem[labelKey] ?? "")
              : placeholder || `Select ${label}`}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        initialFocus={false}
        side="bottom"
        align="start"
        sideOffset={4}
        className="min-w-0 p-0"
        style={contentWidth ? { width: `${contentWidth}px` } : undefined}
      >
        <div className="bg-background overflow-hidden rounded-md">
          <div className="flex items-center gap-2 border-b px-3">
            <SearchIcon className="size-4 shrink-0 opacity-50" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search ${label.toLowerCase()}...`}
              className="h-10 rounded-none border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            />
          </div>

          <div className="max-h-64 overflow-y-auto p-1">
            {filteredItems.length === 0 ? (
              <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                No {label.toLowerCase()} found.
              </div>
            ) : (
              filteredItems.map((item) => {
                const isSelected =
                  String(item[valueKey] ?? "") === String(field.value ?? "");

                return (
                  <button
                    key={String(item[valueKey] ?? item[labelKey] ?? "")}
                    type="button"
                    onClick={() => {
                      field.onChange(item[valueKey]);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      isSelected && "bg-accent text-accent-foreground",
                    )}
                  >
                    <span className="truncate">
                      {String(item[labelKey] ?? "")}
                    </span>
                    <Check
                      className={cn(
                        "ml-2 h-4 w-4 shrink-0",
                        isSelected ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </button>
                );
              })
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/** @deprecated Use ComboboxField instead. */
export const SelectInput = ComboboxField;
