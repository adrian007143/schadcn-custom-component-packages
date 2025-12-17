// components/shared/currency-input.tsx

import React from "react";
import { InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { LazyFieldInputProps } from "../forms/form-field";
import { formatCurrency } from "../forms/form-field/field-utils/currency-utils";


export function CurrencyInput({
  field,
  props,
  disabled,
  inputClasses,
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
    <InputGroupInput
      {...props.inputProps}
      {...field}
      disabled={disabled ?? props.inputProps?.disabled}
      className={cn(inputClasses, props.inputProps?.className, {
        "text-right": props.textAlign === "right",
      })}
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
