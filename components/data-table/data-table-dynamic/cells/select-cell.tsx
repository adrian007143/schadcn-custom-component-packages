"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectOption {
  label: string;
  value: unknown;
}

interface SelectCellProps {
  value: unknown;
  options: SelectOption[];
  onChange: (value: unknown) => void;
}

export function SelectCell({ value, options, onChange }: SelectCellProps) {
  const stringValue =
    value === null || value === undefined ? undefined : String(value);

  return (
    <Select defaultValue={stringValue} onValueChange={(v) => onChange(v)}>
      <SelectTrigger className="h-8 w-full">
        <SelectValue placeholder="Select..." />
      </SelectTrigger>
      <SelectContent className="border border-input/60 shadow-sm rounded-md">
        {options.map((opt) => (
          <SelectItem key={String(opt.value)} value={String(opt.value)}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
