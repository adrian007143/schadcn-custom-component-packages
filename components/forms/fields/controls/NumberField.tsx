"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { FieldPath, FieldValues } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { FieldControlProps } from "@/components/forms/core/types";

export function NumberField<
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
  const describedBy = invalid
    ? [descriptionId, messageId].filter(Boolean).join(" ")
    : descriptionId;
  const step = props.numberStep ?? 1;
  const min = props.numberMin;
  const max = props.numberMax;
  const currentValue =
    typeof field.value === "number" ? field.value : field.value === "" ? "" : "";

  const clamp = (nextValue: number) => {
    if (typeof min === "number" && nextValue < min) {
      return min;
    }

    if (typeof max === "number" && nextValue > max) {
      return max;
    }

    return nextValue;
  };

  return (
    <div className="flex h-full w-full items-center">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={props.disabled}
        className="h-full rounded-none border-r border-border"
        onClick={() =>
          field.onChange(
            clamp((typeof currentValue === "number" ? currentValue : 0) - step)
          )
        }
      >
        <MinusIcon className="size-4" />
        <span className="sr-only">Decrease value</span>
      </Button>
      <Input
        id={fieldId}
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        value={currentValue}
        disabled={props.disabled}
        aria-invalid={invalid}
        aria-describedby={describedBy || undefined}
        className={cn(
          "h-full rounded-none border-0 text-center tabular-nums shadow-none focus-visible:ring-0",
          props.inputClassName
        )}
        onBlur={field.onBlur}
        onChange={(event) => {
          const nextValue = event.target.value;
          field.onChange(nextValue === "" ? "" : clamp(Number(nextValue)));
        }}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={props.disabled}
        className="h-full rounded-none border-l border-border"
        onClick={() =>
          field.onChange(
            clamp((typeof currentValue === "number" ? currentValue : 0) + step)
          )
        }
      >
        <PlusIcon className="size-4" />
        <span className="sr-only">Increase value</span>
      </Button>
    </div>
  );
}
