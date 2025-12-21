"use client";

import { useEffect, useState, useRef, useCallback, KeyboardEvent } from "react";

import {
  Command,
  CommandList,
  CommandInput,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";

import { cn } from "@/lib/utils";
import { Loader2, Plus, X } from "lucide-react";
import { SelectLabelKey, StringKeyOf, InputHeight } from "../types";

export interface AsyncSelectProps<T extends Record<string, unknown>> {
  value: string | number | null;
  onChange: (value: string | number | null) => void;

  data?: T[];
  loadOptions?: (query: string) => Promise<T[]>;

  valueKey: StringKeyOf<T>;
  selectLabelKey: SelectLabelKey<T>;

  placeholder?: string;
  disabled?: boolean;
  debounceTime?: number;
  borderless?: boolean;
  height?: InputHeight;
  iconSearch?: boolean;

  onAddNew?: () => void;
  addNewLabel?: string;
}

/* ---------------------------------------------
 * Debounce hook helper
 * --------------------------------------------- */

function useDebounce<T>(value: T, delay: number = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

/* ---------------------------------------------
 * Label extractors
 * --------------------------------------------- */

function getPrimary<T extends Record<string, unknown>>(
  item: T,
  key: SelectLabelKey<T>
): string {
  if (typeof key === "string") {
    return item[key] != null ? String(item[key]) : "";
  }

  const raw = item[key.primary.key];
  return key.primary.format
    ? String(key.primary.format(raw, item))
    : String(raw ?? "");
}

function getColumns<T extends Record<string, unknown>>(
  item: T,
  key: SelectLabelKey<T>
) {
  if (typeof key === "string" || !key.columns) return [];

  return key.columns.map((c) => {
    const raw = item[c.key];
    const formatted = c.format ? c.format(raw, item) : raw;

    return {
      width: c.width ?? 140,
      value: formatted != null ? String(formatted) : "",
    };
  });
}

/* ---------------------------------------------
 * MAIN COMPONENT
 * --------------------------------------------- */
export function AsyncSelect<T extends Record<string, unknown>>({
  value,
  onChange,
  data,
  loadOptions,
  valueKey,
  selectLabelKey,
  placeholder = "Select...",
  disabled = false,
  debounceTime = 300,
  onAddNew,
  addNewLabel = "Add New",
}: AsyncSelectProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<T[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [position, setPosition] = useState<"above" | "below">("below");

  const debouncedQuery = useDebounce(query, debounceTime);
  const hasStatic = Array.isArray(data) && data.length > 0;

  /* ---------------------------------------------
   * Fetch list
   * --------------------------------------------- */
  const fetchList = useCallback(
    async (search: string): Promise<T[]> => {
      const q = search.toLowerCase();

      if (hasStatic && data) {
        return data.filter((item) =>
          getPrimary(item, selectLabelKey).toLowerCase().includes(q)
        );
      }

      return loadOptions ? loadOptions(search) : [];
    },
    [hasStatic, data, loadOptions, selectLabelKey]
  );

  /* ---------------------------------------------
   * Hydrate selected value
   * --------------------------------------------- */
  useEffect(() => {
    if (value == null) return;

    const loadSource =
      hasStatic && data
        ? Promise.resolve(data)
        : loadOptions?.("") ?? Promise.resolve([]);

    loadSource.then((source) => {
      const found = source.find((item) => item[valueKey] === value);
      if (found) setQuery(getPrimary(found, selectLabelKey));
    });
  }, [value, data, loadOptions, hasStatic, selectLabelKey, valueKey]);

  /* ---------------------------------------------
   * Search effect
   * --------------------------------------------- */
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);

      const list =
        debouncedQuery.trim() === ""
          ? await fetchList("")
          : await fetchList(debouncedQuery);

      if (cancelled) return;

      setOptions(list);
      setHighlightIndex(list.length > 0 ? 0 : -1);
      setLoading(false);
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, fetchList]);

  const openList = () => {
    setLoading(true);
    fetchList("")
      .then((list) => {
        setOptions(list);
        setHighlightIndex(list.length > 0 ? 0 : -1);
      })
      .finally(() => setLoading(false));

    setOpen(true);
  };

  /* ---------------------------------------------
   * Dropdown placement
   * --------------------------------------------- */
  const computePlacement = useCallback(() => {
    if (!containerRef.current || !dropdownRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const dropdownHeight = dropdownRef.current.offsetHeight;

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    setPosition(
      spaceBelow < dropdownHeight && spaceAbove > dropdownHeight
        ? "above"
        : "below"
    );
  }, []);

  useEffect(() => {
    if (open) requestAnimationFrame(computePlacement);
  }, [open, options, computePlacement]);

  /* ---------------------------------------------
   * Outside click to close
   * --------------------------------------------- */
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------------------------------------------
   * Keyboard navigation
   * --------------------------------------------- */
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, options.length));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    }

    if (e.key === "Enter") {
      e.preventDefault();

      if (highlightIndex === options.length && onAddNew) {
        onAddNew();
        setOpen(false);
        return;
      }

      if (highlightIndex >= 0 && highlightIndex < options.length) {
        const item = options[highlightIndex];
        onChange(item[valueKey] as never);
        setQuery(getPrimary(item, selectLabelKey));
        setOpen(false);
      }
    }

    if (e.key === "Escape") setOpen(false);
  };

  /* ---------------------------------------------
   * Wrapper styling (fixed px-3 + bg-input)
   * --------------------------------------------- */
  const wrapperClass = cn(
    "relative w-full h-full flex items-center",
    disabled && "opacity-50 cursor-not-allowed"
  );

  /* ---------------------------------------------
   * RENDER
   * --------------------------------------------- */
  return (
    <div ref={containerRef} className="relative w-full h-full">
      <Command shouldFilter={false} className="w-full h-full bg-transparent">
        <div className={wrapperClass}>
          <CommandInput
            disabled={disabled}
            // iconSearch={iconSearch}
            placeholder={placeholder}
            value={query}
            onFocus={openList}
            onValueChange={(val) => {
              setQuery(val);
              setOpen(true);
            }}
            onKeyDown={onKeyDown}
            className={cn(
              "w-full h-full bg-transparent px-0 py-0 text-sm",
              "placeholder:text-muted-foreground/60",
              "focus-visible:ring-0 focus-visible:ring-offset-0"
            )}
          />

          {loading && (
            <Loader2 className="absolute right-8 h-4 w-4 animate-spin text-muted-foreground" />
          )}

          {query && !loading && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                onChange(null);
                setOpen(false);
              }}
              className="absolute right-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {open && (
          <div
            ref={dropdownRef}
            className={cn(
              "absolute left-0 right-0 z-50",
              "rounded-md border border-border bg-popover",
              "shadow-md animate-in fade-in zoom-in-95",
              position === "below" ? "top-full mt-1" : "bottom-full mb-1"
            )}
          >
            <CommandList className="max-h-64 overflow-auto pb-14">
              {loading && (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  Loading...
                </div>
              )}

              {!loading && options.length === 0 && (
                <CommandEmpty>No results found.</CommandEmpty>
              )}

              {!loading &&
                options.map((item, idx) => {
                  const primary = getPrimary(item, selectLabelKey);
                  const cols = getColumns(item, selectLabelKey);

                  return (
                    <CommandItem
                      key={String(item[valueKey])}
                      onMouseEnter={() => setHighlightIndex(idx)}
                      onSelect={() => {
                        onChange(item[valueKey] as never);
                        setQuery(primary);
                        setOpen(false);
                      }}
                      className={cn(
                        "cursor-pointer px-3 hover:bg-accent hover:text-accent-foreground",
                        highlightIndex === idx &&
                          "bg-accent text-accent-foreground"
                      )}
                    >
                      <div className="flex w-full items-center">
                        <div className="flex-1 truncate font-medium">
                          {primary}
                        </div>

                        {cols.length > 0 && (
                          <div className="flex items-center space-x-4 ml-4 text-sm text-muted-foreground">
                            {cols.map((c, i) => (
                              <div
                                key={i}
                                style={{ width: c.width }}
                                className="truncate"
                              >
                                {c.value}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CommandItem>
                  );
                })}
            </CommandList>

            {onAddNew && (
              <div className="sticky bottom-0 border-t border-border bg-popover">
                <button
                  type="button"
                  onClick={() => {
                    onAddNew();
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2 text-sm text-primary",
                    "hover:bg-accent hover:text-accent-foreground",
                    highlightIndex === options.length &&
                      "bg-accent text-accent-foreground"
                  )}
                >
                  <Plus className="h-4 w-4" /> {addNewLabel}
                </button>
              </div>
            )}
          </div>
        )}
      </Command>
    </div>
  );
}
