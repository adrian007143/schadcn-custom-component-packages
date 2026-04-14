import type {
  ControllerRenderProps,
  Control,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import type { ComponentProps, ReactNode } from "react";

import { Switch } from "@/components/ui/switch";
import type { FormFieldType } from "./constants";

export type InputHeight = "sm" | "md" | "lg" | "xl" | "auto";
export type FieldColSpan = 1 | 2 | 3 | 4 | "full";

export type StringKeyOf<T> = Extract<keyof T, string>;

export type SelectFormatFn<Value = unknown, Row = unknown> = (
  value: Value,
  row: Row
) => string;

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

export interface FieldRendererProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TRow extends Record<string, unknown> = Record<string, unknown>
> {
  control: Control<TFieldValues>;
  name: TName;
  fieldType: FormFieldType;
  label?: string;
  description?: string;
  show?: (values: TFieldValues) => boolean;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  hideLabel?: boolean;
  hideDescription?: boolean;
  hideMessage?: boolean;
  height?: InputHeight;
  colSpan?: FieldColSpan;
  prefix?: ReactNode;
  suffix?: ReactNode;
  wrapperClassName?: string;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  messageClassName?: string;
  inputProps?: ComponentProps<"input">;
  textareaProps?: ComponentProps<"textarea">;
  passwordProps?: ComponentProps<"input">;
  switchProps?: ComponentProps<typeof Switch>;
  data?: TRow[];
  labelKey?: StringKeyOf<TRow>;
  valueKey?: StringKeyOf<TRow>;
  selectLabelKey?: SelectLabelKey<TRow>;
  radioOrientation?: "horizontal" | "vertical";
  sliderMin?: number;
  sliderMax?: number;
  sliderStep?: number;
  showSliderValue?: boolean;
  otpLength?: number;
  maxSelected?: number;
  numberMin?: number;
  numberMax?: number;
  numberStep?: number;
  loadOptions?: (query: string) => Promise<TRow[]>;
  debounceTime?: number;
  onAddNew?: () => void;
  addNewLabel?: string;
  borderless?: boolean;
  iconSearch?: boolean;
  currencyLocale?: string;
  decimalPlaces?: number;
  thousandSeparator?: boolean;
  trimTrailingZeros?: boolean;
  percentDecimalPlaces?: number;
  textAlign?: "left" | "right";
  mask?: string;
  maskPlaceholder?: string;
  renderSkeleton?: (
    field: ControllerRenderProps<TFieldValues, TName>
  ) => ReactNode;
  loaderMode?: "spinner" | "skeleton";
  loaderSize?: "sm" | "md" | "lg";
  loaderRadius?: "none" | "sm" | "md" | "lg";
  type?: ComponentProps<"input">["type"];
}

export interface FieldControlProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TRow extends Record<string, unknown> = Record<string, unknown>
> {
  field: ControllerRenderProps<TFieldValues, TName>;
  fieldId: string;
  descriptionId: string;
  messageId: string;
  invalid: boolean;
  props: FieldRendererProps<TFieldValues, TName, TRow>;
}

export interface LazyFieldInputProps {
  field: ControllerRenderProps<FieldValues, string>;
  props: FieldRendererProps<FieldValues, string, Record<string, unknown>>;
  disabled?: boolean;
  className?: string;
}

/** @deprecated Use FieldRendererProps instead. */
export type CustomProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TRow extends Record<string, unknown> = Record<string, unknown>
> = FieldRendererProps<TFieldValues, TName, TRow>;

/** @deprecated Use FieldControlProps instead. */
export type RenderInputProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> = FieldControlProps<TFieldValues, TName>;
