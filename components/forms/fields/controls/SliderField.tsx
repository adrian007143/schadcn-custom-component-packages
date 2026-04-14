"use client";

import { FieldPath, FieldValues } from "react-hook-form";

import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
} from "@/components/ui/slider";

import { FieldControlProps } from "@/components/forms/core/types";

export function SliderField<
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
  const value =
    typeof field.value === "number" ? field.value : props.sliderMin ?? 0;

  return (
    <div className="flex w-full items-center gap-3 px-1">
      <Slider
        id={fieldId}
        name={field.name}
        value={value}
        min={props.sliderMin ?? 0}
        max={props.sliderMax ?? 100}
        step={props.sliderStep ?? 1}
        disabled={props.disabled}
        aria-invalid={invalid}
        aria-describedby={describedBy || undefined}
        className="flex-1"
        onValueChange={(nextValue) => field.onChange(nextValue)}
      >
        <SliderControl>
          <SliderTrack>
            <SliderIndicator />
          </SliderTrack>
          <SliderThumb />
        </SliderControl>
      </Slider>
      {props.showSliderValue && (
        <span className="text-muted-foreground min-w-10 text-right text-sm tabular-nums">
          {value}
        </span>
      )}
    </div>
  );
}
