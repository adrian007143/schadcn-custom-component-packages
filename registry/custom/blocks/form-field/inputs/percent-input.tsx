import { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";
import React, { useState } from "react";

import { cn } from "@/lib/utils";
import { RenderInputProps } from "../types";
import { Input } from "@/components/ui/input";

export function PercentInput<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  field,
  props,
  disabled,
  className,
}: {
  field: ControllerRenderProps<TFieldValues, TName>;
  props: RenderInputProps<TFieldValues, TName>["props"];
  disabled?: boolean;
  className?: string;
}) {
  const [uiValue, setUiValue] = useState("");

  // ✅ Prevent syncing from RHF while user is typing
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
    <Input
      {...props.inputProps}
      {...field}
      disabled={disabled ?? props.inputProps?.disabled}
      className={cn("text-right tabular-nums", className)}
      value={uiValue}
      placeholder={props.placeholder ?? props.inputProps?.placeholder ?? "0%"}
      onChange={(e) => {
        isEditingRef.current = true;
        if (/^[0-9.%]*$/.test(e.target.value)) setUiValue(e.target.value);
      }}
      onBlur={() => {
        isEditingRef.current = false;

        const raw = uiValue.replace("%", "").trim();
        const parsed = parseFloat(raw);

        if (isNaN(parsed)) {
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
