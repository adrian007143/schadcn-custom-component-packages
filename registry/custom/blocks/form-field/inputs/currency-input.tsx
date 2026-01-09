import React from "react";

import { cn } from "@/lib/utils";
import { LazyFieldInputProps } from "../types";
import { formatCurrency } from "../field-utils/currency-utils";
import { Input } from "@/components/ui/input";

export function CurrencyInput({
  field,
  props,
  disabled,
  className,
}: LazyFieldInputProps) {
  const [uiValue, setUiValue] = React.useState("");

  // ✅ Prevent syncing from RHF while user is typing
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
      onChange={(e) => {
        isEditingRef.current = true;

        const raw = e.target.value;
        if (/^[0-9,.\s]*$/.test(raw)) setUiValue(raw);
      }}
      onBlur={() => {
        isEditingRef.current = false;

        const num = parseFloat(uiValue.replace(/,/g, ""));
        if (isNaN(num)) {
          field.onChange(null);
          setUiValue("");
        } else {
          field.onChange(num);
          setUiValue(
            formatCurrency(
              num,
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
