import React, { useState } from "react";
import {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";

import { InputGroupInput } from "@/components/ui/input-group";
import { FieldRendererProps } from "@/components/forms/core/types";
import { cn } from "@/lib/utils";

export function PercentField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TRow extends Record<string, unknown> = Record<string, unknown>
>({
  field,
  props,
  disabled,
  className,
}: {
  field: ControllerRenderProps<TFieldValues, TName>;
  props: FieldRendererProps<TFieldValues, TName, TRow>;
  disabled?: boolean;
  className?: string;
}) {
  const [uiValue, setUiValue] = useState("");
  const isEditingRef = React.useRef(false);

  const places = props.percentDecimalPlaces ?? 2;

  React.useEffect(() => {
    if (isEditingRef.current) return;

    if (typeof field.value === "number") {
      setUiValue((field.value * 100).toFixed(places) + "%");
    } else {
      setUiValue("");
    }
  }, [field.value, places]);

  return (
    <InputGroupInput
      {...props.inputProps}
      {...field}
      disabled={disabled ?? props.inputProps?.disabled}
      className={cn("text-right tabular-nums", className)}
      value={uiValue}
      placeholder={props.placeholder ?? props.inputProps?.placeholder ?? "0%"}
      onChange={(event) => {
        isEditingRef.current = true;
        if (/^[0-9.%]*$/.test(event.target.value)) setUiValue(event.target.value);
      }}
      onBlur={() => {
        isEditingRef.current = false;

        const raw = uiValue.replace("%", "").trim();
        const parsed = parseFloat(raw);

        if (Number.isNaN(parsed)) {
          field.onChange(null);
          setUiValue("");
        } else {
          field.onChange(parsed / 100);
          setUiValue(parsed.toFixed(places) + "%");
        }
      }}
    />
  );
}

/** @deprecated Use PercentField instead. */
export const PercentInput = PercentField;
