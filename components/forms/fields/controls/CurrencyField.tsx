import React from "react";

import { Input } from "@/components/ui/input";
import { LazyFieldInputProps } from "@/components/forms/core/types";
import { cn } from "@/lib/utils";

import { formatCurrency } from "../utils/currency";

export function CurrencyField({
  field,
  props,
  disabled,
  className,
}: LazyFieldInputProps) {
  const [uiValue, setUiValue] = React.useState("");
  const isEditingRef = React.useRef(false);

  const locale = props.currencyLocale ?? "en-PH";
  const decimalPlaces = props.decimalPlaces ?? 2;
  const thousandSeparator = props.thousandSeparator ?? true;
  const trimTrailingZeros = props.trimTrailingZeros ?? false;

  React.useEffect(() => {
    if (isEditingRef.current) return;

    if (typeof field.value === "number") {
      setUiValue(
        formatCurrency(
          field.value,
          locale,
          decimalPlaces,
          thousandSeparator,
          trimTrailingZeros
        )
      );
    } else {
      setUiValue("");
    }
  }, [
    field.value,
    locale,
    decimalPlaces,
    thousandSeparator,
    trimTrailingZeros,
  ]);

  return (
    <Input
      {...props.inputProps}
      {...field}
      disabled={disabled ?? props.inputProps?.disabled}
      className={cn("text-right tabular-nums", className)}
      value={uiValue}
      placeholder={props.placeholder ?? props.inputProps?.placeholder ?? ""}
      onChange={(event) => {
        isEditingRef.current = true;

        const raw = event.target.value;
        if (/^[0-9,.\s]*$/.test(raw)) setUiValue(raw);
      }}
      onBlur={() => {
        isEditingRef.current = false;

        const nextValue = parseFloat(uiValue.replace(/,/g, ""));
        if (Number.isNaN(nextValue)) {
          field.onChange(null);
          setUiValue("");
        } else {
          field.onChange(nextValue);
          setUiValue(
            formatCurrency(
              nextValue,
              locale,
              decimalPlaces,
              thousandSeparator,
              trimTrailingZeros
            )
          );
        }
      }}
    />
  );
}

/** @deprecated Use CurrencyField instead. */
export const CurrencyInput = CurrencyField;
