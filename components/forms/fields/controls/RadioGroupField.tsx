"use client";

import { FieldPath, FieldValues } from "react-hook-form";

import {
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

import { FieldControlProps, StringKeyOf } from "@/components/forms/core/types";

export function RadioGroupField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TRow extends Record<string, unknown> = Record<string, unknown>
>({
  field,
  fieldId,
  descriptionId,
  messageId,
  invalid,
  props,
}: FieldControlProps<TFieldValues, TName, TRow>) {
  const options = props.data ?? [];
  const labelKey = (props.labelKey ?? "label") as StringKeyOf<
    (typeof options)[number]
  >;
  const valueKey = (props.valueKey ?? "value") as StringKeyOf<
    (typeof options)[number]
  >;
  const describedBy = invalid
    ? [descriptionId, messageId].filter(Boolean).join(" ")
    : descriptionId;

  return (
    <RadioGroup
      name={field.name}
      value={field.value ?? undefined}
      onValueChange={(value) => field.onChange(value)}
      disabled={props.disabled}
      required={props.required}
      aria-invalid={invalid}
      aria-describedby={describedBy || undefined}
      className={cn(
        "w-full",
        props.radioOrientation === "horizontal"
          ? "flex flex-wrap gap-3"
          : "flex flex-col gap-2"
      )}
    >
      {options.map((option, index) => {
        const optionLabel = option[labelKey];
        const optionValue = option[valueKey];

        return (
          <label
            key={`${fieldId}-${String(optionValue)}-${index}`}
            className={cn(
              "border-input has-data-[checked]:border-primary has-data-[checked]:bg-primary/5 flex min-h-10 items-center gap-3 rounded-md border px-3 py-2 text-sm transition-colors",
              props.disabled && "cursor-not-allowed opacity-60"
            )}
          >
            <RadioGroupItem
              value={optionValue}
              aria-label={props.hideLabel ? String(optionLabel) : undefined}
            >
              <RadioGroupIndicator />
            </RadioGroupItem>
            <span className="flex-1 leading-snug">{String(optionLabel)}</span>
          </label>
        );
      })}
    </RadioGroup>
  );
}
