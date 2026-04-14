"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectOptionCellProps {
  value: unknown;
  options: { label: string; value: unknown }[];
  onChange: (value: unknown) => void;
}

export function SelectOptionCell({
  value,
  options,
  onChange,
}: SelectOptionCellProps) {
  return (
    <Select
      value={value === null || value === undefined ? "" : String(value)}
      onValueChange={onChange}
    >
      <SelectTrigger className="h-8 min-w-[120px]">
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={String(option.value)} value={String(option.value)}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/** @deprecated Use SelectOptionCell instead. */
export const SelectCell = SelectOptionCell;
