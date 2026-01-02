import type {
  ControllerRenderProps,
  Control,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import type { ComponentProps, ReactNode } from "react";
import type { FormFieldType } from "./constants";
import * as SwitchPrimitive from "@radix-ui/react-switch";

/* -------------------------------------------
 * HEIGHT TYPES
 * ------------------------------------------- */
export type InputHeight = "sm" | "md" | "lg" | "xl" | "auto";

/* -------------------------------------------
 * SELECT TYPES
 * ------------------------------------------- */

/** String-only keys of a row object */
export type StringKeyOf<T> = Extract<keyof T, string>;

/** Formatter function for select labels */
export type SelectFormatFn<Value = unknown, Row = unknown> = (
  value: Value,
  row: Row
) => string;

/**
 * Label configuration for select / async select
 */
export type SelectLabelKey<Row> =
  | StringKeyOf<Row>
  | {
      primary: {
        key: StringKeyOf<Row>;
        format?: SelectFormatFn<Row[StringKeyOf<Row>], Row>;
      };
      columns?: Array<{
        key: StringKeyOf<Row>;
        width?: number;
        format?: SelectFormatFn<Row[StringKeyOf<Row>], Row>;
      }>;
    };

/* -------------------------------------------
 * MAIN CUSTOM FIELD PROPS
 * ------------------------------------------- */

export interface CustomProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TRow extends Record<string, unknown> = Record<string, unknown>
> {
  /* React Hook Form */
  control: Control<TFieldValues>;
  name: TName;
  fieldType: FormFieldType;

  /* Labels & text */
  label?: string;
  description?: string;
  placeholder?: string;

  /* State */
  disabled?: boolean;
  required?: boolean;

  /* Visibility */
  hideLabel?: boolean;
  hideDescription?: boolean;
  hideMessage?: boolean;

  /* Layout */
  height?: InputHeight;
  prefix?: ReactNode;
  suffix?: ReactNode;

  /* Styling */
  wrapperClassName?: string;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  messageClassName?: string;

  /* Native HTML passthrough */
  inputProps?: ComponentProps<"input">;
  textareaProps?: ComponentProps<"textarea">;
  passwordProps?: ComponentProps<"input">;
  switchProps?: ComponentProps<typeof SwitchPrimitive.Root>;

  /* ---------------- SELECT / COMMAND ---------------- */
  data?: TRow[];
  labelKey?: StringKeyOf<TRow>;
  valueKey?: StringKeyOf<TRow>;
  selectLabelKey?: SelectLabelKey<TRow>;

  /* ---------------- ASYNC SELECT ---------------- */
  loadOptions?: (query: string) => Promise<TRow[]>;
  debounceTime?: number;
  onAddNew?: () => void;
  addNewLabel?: string;
  borderless?: boolean;
  iconSearch?: boolean;

  /* ---------------- CURRENCY ---------------- */
  currencyLocale?: string;
  decimalPlaces?: number;
  thousandSeparator?: boolean;
  trimTrailingZeros?: boolean;

  /* ---------------- PERCENT ---------------- */
  percentDecimalPlaces?: number;
  textAlign?: "left" | "right";

  /* ---------------- MASKED INPUT ---------------- */
  mask?: string;
  maskPlaceholder?: string;

  /* ---------------- SKELETON ---------------- */
  renderSkeleton?: (
    field: ControllerRenderProps<TFieldValues, TName>
  ) => ReactNode;
  loaderMode?: "spinner" | "skeleton";
  loaderSize?: "sm" | "md" | "lg";
  loaderRadius?: "none" | "sm" | "md" | "lg";

  /* ---------------- DEFAULT INPUT ---------------- */
  type?: ComponentProps<"input">["type"];
}

/* -------------------------------------------
 * RENDER INPUT PROPS
 * ------------------------------------------- */

export interface RenderInputProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> {
  field: ControllerRenderProps<TFieldValues, TName>;
  props: CustomProps<TFieldValues, TName>;
}

/* -------------------------------------------
 * Define a non-generic base props type for lazy inputs
 * ------------------------------------------- */

export interface LazyFieldInputProps {
  field: ControllerRenderProps<FieldValues, string>;
  props: CustomProps<FieldValues, string, Record<string, unknown>>;
  disabled?: boolean;
  className?: string;
}

/**
 * Widen RHF generics for lazy components.
 * This is a REQUIRED boundary for next/dynamic.
 */
export function toLazyFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>(
  field: ControllerRenderProps<TFieldValues, TName>,
  props: CustomProps<TFieldValues, TName>
) {
  return {
    field: field as unknown as ControllerRenderProps<FieldValues, string>,
    props: props as unknown as CustomProps<
      FieldValues,
      string,
      Record<string, unknown>
    >,
  };
}
