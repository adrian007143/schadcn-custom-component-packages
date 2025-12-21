"use client";

import { useEffect, useState, useRef, useCallback, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { Loader2, Plus, X, Search } from "lucide-react";
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
 * HEIGHT CLASSES (should match render-dynamic-input.tsx)
 * --------------------------------------------- */
const HEIGHT_CLASSES: Record<InputHeight, string> = {
  sm: "h-8",
  md: "h-9",
  lg: "h-10",
  xl: "h-11",
  auto: "h-auto",
};

/* ---------------------------------------------
 * PADDING CLASSES based on height for consistency
 * --------------------------------------------- */
const PADDING_CLASSES: Record<InputHeight, { x: string; iconLeft: string; iconRight: string }> = {
  sm: { x: "px-2", iconLeft: "left-2", iconRight: "right-2" },
  md: { x: "px-3", iconLeft: "left-3", iconRight: "right-3" },
  lg: { x: "px-3", iconLeft: "left-3", iconRight: "right-3" },
  xl: { x: "px-4", iconLeft: "left-4", iconRight: "right-4" },
  auto: { x: "px-3", iconLeft: "left-3", iconRight: "right-3" },
};

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
  // borderless = false,
  height = "md",
  iconSearch = false,
  onAddNew,
  addNewLabel = "Add New",
}: AsyncSelectProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<T[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [position, setPosition] = useState<"above" | "below">("below");

  const debouncedQuery = useDebounce(query, debounceTime);
  const hasStatic = Array.isArray(data) && data.length > 0;

  const padding = PADDING_CLASSES[height];

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
    // Focus the input when dropdown opens
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
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
   * Handle clear button
   * --------------------------------------------- */
  const handleClear = () => {
    setQuery("");
    onChange(null);
    setOpen(false);
    inputRef.current?.focus();
  };

  /* ---------------------------------------------
   * Wrapper and input styling
   * --------------------------------------------- */
  const wrapperClass = cn(
    "relative w-full h-full flex items-center",
    HEIGHT_CLASSES[height],
    disabled && "opacity-50 cursor-not-allowed"
  );

  // Calculate left padding based on iconSearch
  const getLeftPadding = () => {
    return iconSearch ? `pl-10` : padding.x.split(" ")[0];
  };

  // Calculate right padding based on clear/loading buttons
  const getRightPadding = () => {
    if (query || loading) {
      return "pr-10";
    }
    return padding.x.split(" ")[1] || "pr-3";
  };

  const inputClass = cn(
    "w-full h-full bg-transparent text-sm leading-none",
    "placeholder:text-muted-foreground/60",
    "focus-visible:outline-none focus-visible:ring-0",
    "border-0 outline-none",
    disabled && "cursor-not-allowed",
    getLeftPadding(),
    getRightPadding()
  );

  /* ---------------------------------------------
   * RENDER
   * --------------------------------------------- */
  return (
    <div ref={containerRef} className="relative w-full h-full">
      <div className={wrapperClass}>
        {/* Search Icon - More subtle styling */}
        {iconSearch && (
          <div className={cn(
            "absolute top-1/2 -translate-y-1/2",
            padding.iconLeft,
            "text-muted-foreground/70"
          )}>
            <Search className="h-4 w-4" />
          </div>
        )}

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          disabled={disabled}
          placeholder={placeholder}
          value={query}
          onFocus={openList}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          className={inputClass}
        />

        {/* Loading Spinner */}
        {loading && (
          <div className={cn(
            "absolute top-1/2 -translate-y-1/2",
            padding.iconRight,
            "text-muted-foreground"
          )}>
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}

        {/* Clear Button */}
        {query && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              "absolute top-1/2 -translate-y-1/2",
              padding.iconRight,
              "text-muted-foreground hover:text-foreground transition-colors"
            )}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
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
          <div className="max-h-64 overflow-auto py-1">
            {loading && (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                Loading...
              </div>
            )}

            {!loading && options.length === 0 && (
              <div className="px-3 py-3 text-center text-sm text-muted-foreground/80">
                No results found.
              </div>
            )}

            {!loading &&
              options.map((item, idx) => {
                const primary = getPrimary(item, selectLabelKey);
                const cols = getColumns(item, selectLabelKey);

                return (
                  <button
                    key={String(item[valueKey])}
                    type="button"
                    onMouseEnter={() => setHighlightIndex(idx)}
                    onClick={() => {
                      onChange(item[valueKey] as never);
                      setQuery(primary);
                      setOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground",
                      "transition-colors duration-150",
                      highlightIndex === idx &&
                        "bg-accent text-accent-foreground",
                      "flex items-center justify-between"
                    )}
                  >
                    <div className="flex-1 truncate text-sm">
                      {primary}
                    </div>

                    {cols.length > 0 && (
                      <div className="flex items-center space-x-4 ml-4 text-xs text-muted-foreground">
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
                  </button>
                );
              })}
          </div>

          {/* Add New Button */}
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
                  "hover:bg-accent hover:text-accent-foreground transition-colors",
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
    </div>
  );
}
