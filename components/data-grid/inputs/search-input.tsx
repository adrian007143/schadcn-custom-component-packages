"use client";

import * as React from "react";
import { SearchIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
}

export function SearchInput({
  value,
  onChange,
  onClear,
  className,
  ...props
}: SearchInputProps) {
  return (
    <div className="relative max-w-sm">
      <div className="group relative flex h-10 w-full items-center rounded-md border border-border bg-background pl-10 pr-10 shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary/30 sm:w-72">
        <SearchIcon className="absolute left-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <Input
          value={value}
          onChange={onChange}
          placeholder="Search..."
          className={`h-full w-full border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 ${className ?? ""}`}
          {...props}
        />
        {value && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            aria-label="Clear search"
            className="absolute right-1.5 h-7 w-7 rounded-full text-muted-foreground transition-all hover:bg-muted/40"
          >
            <XIcon className="size-3" />
          </Button>
        )}
      </div>
    </div>
  );
}
