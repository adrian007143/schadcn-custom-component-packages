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

  React.useEffect(() => {
    if (typeof field.value === "number") {
      setUiValue(
        formatCurrency(
          field.value,
          props.currencyLocale ?? "en-PH",
          props.decimalPlaces ?? 2,
          props.thousandSeparator ?? true,
          props.trimTrailingZeros ?? false
        )
      );
    } else {
      setUiValue("");
    }
  }, [
    field.value,
    props.currencyLocale,
    props.decimalPlaces,
    props.thousandSeparator,
    props.trimTrailingZeros,
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
        const raw = e.target.value;
        if (/^[0-9,.\s]*$/.test(raw)) setUiValue(raw);
      }}
      onBlur={() => {
        const num = parseFloat(uiValue.replace(/,/g, ""));
        if (isNaN(num)) {
          field.onChange(null);
          setUiValue("");
        } else {
          field.onChange(num);
          setUiValue(
            formatCurrency(
              num,
              props.currencyLocale ?? "en-PH",
              props.decimalPlaces ?? 2,
              props.thousandSeparator ?? true,
              props.trimTrailingZeros ?? false
            )
          );
        }
      }}
    />
  );
}
