"use client";

import * as React from "react";
import { SearchIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onClear,
  className,
  placeholder = "Search...",
  ...props
}) => {
  return (
    <div
      className={cn(
        "group relative flex h-9 w-full items-center sm:w-64",
        "rounded-lg border border-border/70 bg-background",
        "shadow-sm transition-all duration-200",
        "hover:border-border",
        "focus-within:border-primary/50 focus-within:ring-3 focus-within:ring-primary/15",
        "dark:bg-muted/20 dark:hover:bg-muted/30",
        className
      )}
    >
      {/* Search icon */}
      <SearchIcon
        aria-hidden
        className="pointer-events-none absolute left-3 h-3.5 w-3.5 shrink-0 text-muted-foreground/70 transition-colors duration-150 group-focus-within:text-primary"
      />

      {/* Input */}
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          "h-full w-full bg-transparent pl-9 text-sm text-foreground outline-none",
          "placeholder:text-muted-foreground/60",
          value ? "pr-8" : "pr-3"
        )}
        {...props}
      />

      {/* Clear button */}
      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className={cn(
            "absolute right-2 flex h-5 w-5 shrink-0 items-center justify-center",
            "rounded-full text-muted-foreground/60",
            "transition-all duration-150",
            "hover:bg-muted hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
        >
          <XIcon className="h-3 w-3" />
        </button>
      )}
    </div>
  );
};

export { SearchInput };
