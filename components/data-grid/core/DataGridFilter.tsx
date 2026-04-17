"use client";

import * as React from "react";
import { CheckIcon, ListFilterIcon, XIcon } from "lucide-react";
import { Column } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface DataGridFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

export function DataGridFilter<TData, TValue>({
  column,
  title,
  options,
}: DataGridFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);
  const hasSelected = selectedValues.size > 0;

  const [open, setOpen] = React.useState(false);
  // Saved scroll position — captured just before the popup opens so we can
  // restore it after base-ui / cmdk move focus (which triggers scrollIntoView).
  const savedScroll = React.useRef({ top: 0, left: 0 });

  const handleOpenChange = React.useCallback((next: boolean) => {
    if (next) {
      // Snapshot the current scroll position synchronously before React
      // commits the new state and the popup mounts.
      const el = document.scrollingElement as HTMLElement | null;
      savedScroll.current = {
        top: el?.scrollTop ?? window.scrollY,
        left: el?.scrollLeft ?? window.scrollX,
      };
    }
    setOpen(next);
  }, []);

  // After the popup opens, base-ui and cmdk both call focus() on the
  // CommandInput.  The second call (from cmdk's useLayoutEffect) omits
  // preventScroll, causing the browser to scroll the page.  We restore the
  // saved position one animation frame later — after all layout effects have
  // run — so the page stays put.
  React.useEffect(() => {
    if (!open) return;
    const rafId = requestAnimationFrame(() => {
      const el = document.scrollingElement as HTMLElement | null;
      if (el) {
        el.scrollTop = savedScroll.current.top;
        el.scrollLeft = savedScroll.current.left;
      } else {
        window.scrollTo(savedScroll.current.left, savedScroll.current.top);
      }
    });
    return () => cancelAnimationFrame(rafId);
  }, [open]);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-9 gap-1.5 border-border/70 bg-background text-sm font-normal shadow-sm transition-colors",
            "hover:border-border hover:bg-muted/40",
            hasSelected &&
              "border-primary/40 bg-primary/5 text-primary hover:border-primary/60 hover:bg-primary/10"
          )}
        >
          <ListFilterIcon className="h-3.5 w-3.5 shrink-0" />
          <span>{title}</span>
          {hasSelected && (
            <>
              <Separator orientation="vertical" className="mx-0.5 h-4" />
              <Badge
                variant="secondary"
                className="rounded-md px-1.5 py-0 text-xs font-medium lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden items-center gap-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-md px-1.5 py-0 text-xs font-medium"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        key={option.value}
                        variant="secondary"
                        className="rounded-md px-1.5 py-0 text-xs font-medium"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-52 p-0" align="start">
        <Command>
          <CommandInput
            placeholder={`Search ${title?.toLowerCase() ?? ""}…`}
            className="h-9 text-sm"
          />
          <CommandList>
            <CommandEmpty className="py-4 text-center text-xs text-muted-foreground">
              No results found.
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    className="gap-2 text-sm"
                    onMouseDown={(e) => e.preventDefault()}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }
                      const filterValues = Array.from(selectedValues);
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      );
                    }}
                  >
                    <div
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border/70 bg-background"
                      )}
                    >
                      {isSelected && <CheckIcon className="h-3 w-3" />}
                    </div>

                    {option.icon && (
                      <option.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}

                    <span className="flex-1 truncate">{option.label}</span>

                    {facets?.get(option.value) !== undefined && (
                      <span className="ml-auto tabular-nums text-xs text-muted-foreground">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>

            {hasSelected && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onMouseDown={(e) => e.preventDefault()}
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center gap-1.5 text-center text-xs text-muted-foreground"
                  >
                    <XIcon className="h-3 w-3" />
                    Clear filter
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

/** @deprecated Use DataGridFilter instead. */
export const DataTableFacetedFilter = DataGridFilter;
