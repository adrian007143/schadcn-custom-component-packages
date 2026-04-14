"use client";

import {
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Loader2, Plus, Search, X } from "lucide-react";

import {
  InputHeight,
  SelectLabelKey,
  StringKeyOf,
} from "@/components/forms/core/types";
import { cn } from "@/lib/utils";

export interface AsyncSelectFieldProps<T extends Record<string, unknown>> {
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

function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

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

  return key.columns.map((column) => {
    const raw = item[column.key];
    const formatted = column.format ? column.format(raw, item) : raw;

    return {
      width: column.width ?? 140,
      value: formatted != null ? String(formatted) : "",
    };
  });
}

const HEIGHT_CLASSES: Record<InputHeight, string> = {
  sm: "h-8",
  md: "h-9",
  lg: "h-10",
  xl: "h-11",
  auto: "h-auto",
};

const PADDING_CLASSES: Record<
  InputHeight,
  { x: string; iconLeft: string; iconRight: string }
> = {
  sm: { x: "px-2", iconLeft: "left-2", iconRight: "right-2" },
  md: { x: "px-3", iconLeft: "left-3", iconRight: "right-3" },
  lg: { x: "px-3", iconLeft: "left-3", iconRight: "right-3" },
  xl: { x: "px-4", iconLeft: "left-4", iconRight: "right-4" },
  auto: { x: "px-3", iconLeft: "left-3", iconRight: "right-3" },
};

export function AsyncSelectField<T extends Record<string, unknown>>({
  value,
  onChange,
  data,
  loadOptions,
  valueKey,
  selectLabelKey,
  placeholder = "Select...",
  disabled = false,
  debounceTime = 300,
  height = "md",
  iconSearch = false,
  onAddNew,
  addNewLabel = "Add New",
}: AsyncSelectFieldProps<T>) {
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

  const fetchList = useCallback(
    async (search: string): Promise<T[]> => {
      const normalizedQuery = search.toLowerCase();

      if (hasStatic && data) {
        return data.filter((item) =>
          getPrimary(item, selectLabelKey).toLowerCase().includes(normalizedQuery)
        );
      }

      return loadOptions ? loadOptions(search) : [];
    },
    [data, hasStatic, loadOptions, selectLabelKey]
  );

  useEffect(() => {
    if (value == null) return;

    const sourcePromise =
      hasStatic && data
        ? Promise.resolve(data)
        : loadOptions?.("") ?? Promise.resolve([]);

    sourcePromise.then((source) => {
      const found = source.find((item) => item[valueKey] === value);
      if (found) setQuery(getPrimary(found, selectLabelKey));
    });
  }, [data, hasStatic, loadOptions, selectLabelKey, value, valueKey]);

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

    void run();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, fetchList]);

  const openList = () => {
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());

    if (hasStatic && data) {
      setOptions(data);
      setHighlightIndex(data.length ? 0 : -1);
      return;
    }

    if (options.length === 0) {
      setLoading(true);
      fetchList("")
        .then((list) => {
          setOptions(list);
          setHighlightIndex(list.length ? 0 : -1);
        })
        .finally(() => setLoading(false));
    }
  };

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
    if (!open) return;

    const onResize = () => computePlacement();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    requestAnimationFrame(computePlacement);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [computePlacement, open]);

  useEffect(() => {
    if (!open) return;

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
  }, [open]);

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightIndex((index) => Math.min(index + 1, options.length));
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightIndex((index) => Math.max(index - 1, 0));
    }

    if (event.key === "Enter") {
      event.preventDefault();

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

    if (event.key === "Escape") setOpen(false);
  };

  const handleClear = () => {
    setQuery("");
    onChange(null);
    setOpen(false);
    inputRef.current?.focus();
  };

  const wrapperClass = cn(
    "relative flex h-full w-full items-center",
    HEIGHT_CLASSES[height],
    disabled && "cursor-not-allowed opacity-50"
  );

  const getLeftPadding = () => (iconSearch ? "pl-10" : padding.x.split(" ")[0]);
  const getRightPadding = () =>
    query || loading ? "pr-10" : padding.x.split(" ")[1] || "pr-3";

  const inputClass = cn(
    "h-full w-full border-0 bg-transparent text-sm leading-none outline-none",
    "placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-0",
    disabled && "cursor-not-allowed",
    getLeftPadding(),
    getRightPadding()
  );

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <div className={wrapperClass}>
        {iconSearch && (
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 text-muted-foreground/70",
              padding.iconLeft
            )}
          >
            <Search className="h-4 w-4" />
          </div>
        )}

        <input
          ref={inputRef}
          type="text"
          disabled={disabled}
          placeholder={placeholder}
          value={query}
          onFocus={openList}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          className={inputClass}
        />

        {loading && (
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 text-muted-foreground",
              padding.iconRight
            )}
          >
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}

        {query && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground",
              padding.iconRight
            )}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {open && (
        <div
          ref={dropdownRef}
          className={cn(
            "absolute left-0 right-0 z-50 rounded-md border border-border bg-popover shadow-md animate-in fade-in zoom-in-95",
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
              options.map((item, index) => {
                const primary = getPrimary(item, selectLabelKey);
                const columns = getColumns(item, selectLabelKey);

                return (
                  <button
                    key={String(item[valueKey])}
                    type="button"
                    onMouseEnter={() => setHighlightIndex(index)}
                    onClick={() => {
                      onChange(item[valueKey] as never);
                      setQuery(primary);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between px-3 py-2 text-left transition-colors duration-150 hover:bg-accent hover:text-accent-foreground",
                      highlightIndex === index &&
                        "bg-accent text-accent-foreground"
                    )}
                  >
                    <div className="flex-1 truncate text-sm">{primary}</div>

                    {columns.length > 0 && (
                      <div className="ml-4 flex items-center space-x-4 text-xs text-muted-foreground">
                        {columns.map((column, columnIndex) => (
                          <div
                            key={columnIndex}
                            style={{ width: column.width }}
                            className="truncate"
                          >
                            {column.value}
                          </div>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
          </div>

          {onAddNew && (
            <div className="sticky bottom-0 border-t border-border bg-popover">
              <button
                type="button"
                onClick={() => {
                  onAddNew();
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-sm text-primary transition-colors hover:bg-accent hover:text-accent-foreground",
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

/** @deprecated Use AsyncSelectField instead. */
export const AsyncSelect = AsyncSelectField;
