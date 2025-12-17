import { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";
import { RenderInputProps } from "../forms/form-field";
import React, {useState} from "react";
import { InputGroupInput } from "../ui/input-group";
import { cn } from "@/lib/utils";


export function PercentInput<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  field,
  props,
  disabled,
  inputClasses,
}: {
  field: ControllerRenderProps<TFieldValues, TName>;
  props: RenderInputProps<TFieldValues, TName>["props"];
  disabled?: boolean;
  inputClasses: string;
}) {
  const [uiValue, setUiValue] = useState("");

  React.useEffect(() => {
    if (typeof field.value === "number") {
      setUiValue(
        (field.value * 100).toFixed(props.percentDecimalPlaces ?? 2) + "%"
      );
    } else {
      setUiValue("");
    }
  }, [field.value, props.percentDecimalPlaces]);

  return (
    <InputGroupInput
      {...props.inputProps}
      {...field}
      disabled={disabled ?? props.inputProps?.disabled}
      className={cn(
        inputClasses,
        props.inputProps?.className,
        props.textAlign === "right" && "text-right"
      )}
      value={uiValue}
      placeholder={props.placeholder ?? props.inputProps?.placeholder ?? "0%"}
      onChange={(e) => {
        if (/^[0-9.%]*$/.test(e.target.value)) setUiValue(e.target.value);
      }}
      onBlur={() => {
        const raw = uiValue.replace("%", "").trim();
        const parsed = parseFloat(raw);
        if (isNaN(parsed)) {
          field.onChange(null);
          setUiValue("");
        } else {
          field.onChange(parsed / 100);
          setUiValue(
            parsed.toFixed(props.percentDecimalPlaces ?? 2) + "%"
          );
        }
      }}
    />
  );
}
