"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, XIcon } from "lucide-react";
import React from "react";


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
  ...props
}) => {
  return (
    <div className="relative max-w-sm">
      <div
        className="
          group relative flex items-center
          h-10 w-full sm:w-72
          border border-border bg-background
          pl-10 pr-10
          shadow-sm
          rounded-md
          transition-all
          focus-within:ring-2 focus-within:ring-primary/30
        "
      >
        {/* Icon */}
        <SearchIcon
          className="
            absolute left-3 h-4 w-4 
            text-muted-foreground 
            transition-colors
            group-focus-within:text-primary
          "
        />

        {/* Input */}
        <Input
          value={value}
          onChange={onChange}
          placeholder="Search…"
          className={`
            border-0 shadow-none h-full w-full p-0 
            bg-transparent
            focus-visible:ring-0 focus-visible:ring-offset-0
            ${className ?? ""}
          `}
          {...props}
        />

        {/* Clear Button */}
        {value && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            aria-label="Clear search"
            className="
              absolute right-1.5
              h-7 w-7 rounded-full 
              text-muted-foreground
              hover:bg-muted/40
              transition-all
            "
          >
            <XIcon className="size-3" />
          </Button>
        )}
      </div>
    </div>
  );
};

export {SearchInput};
