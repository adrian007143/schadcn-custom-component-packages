"use client";

import dynamic from "next/dynamic";
import React from "react";
import { FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

import {
  InputGroup,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

import { cn } from "@/lib/utils";
import {
  RenderInputProps,
  InputHeight,
  StringKeyOf,
  SelectLabelKey,
  toLazyFieldProps,
} from "./types";
import { FormFieldType } from "./constants";
import { FieldPath, FieldValues } from "react-hook-form";
import { applyMask } from "./field-utils/mask-utils";

/* -------------------------------------------------------------
 * LAZY COMPONENTS
 * ------------------------------------------------------------- */

const LazyDatePicker = dynamic(() =>
  import("./inputs/date-picker").then((m) => m.DatePicker),
{ ssr: false }
);

const LazyPhoneInput = dynamic(() =>
  import("./inputs/phone-input").then((m) => m.PhoneInput),
{ ssr: false }
);

const LazySelectInput = dynamic(() =>
  import("./inputs/select-input").then((m) => m.SelectInput),
{ ssr: false }
);

const LazySingleSelector = dynamic(() =>
  import("./inputs/single-selector").then((m) => m.SingleSelector),
{ ssr: false }
);

const LazyAsyncSelect = dynamic(
  () => import("./inputs/async-select").then((m) => m.AsyncSelect),
  { ssr: false }
);


const LazyPassword = dynamic(() =>
  import("./inputs/input-password").then((m) => m.InputPassword),
{ ssr: false }
);

const LazzyCurrencyInput = dynamic(() =>
  import("./inputs/currency-input").then((m) => m.CurrencyInput),
{ ssr: false }
);

const LazzyPercentInput = dynamic(() =>
  import("./inputs/percent-input").then((m) => m.PercentInput),
{ ssr: false }
);

const LazySkeleton = dynamic(() =>
  import("./FieldSkeletonLoader").then((m) => m.FieldSkeletonLoader),
{ ssr: false }
);

/* -------------------------------------------------------------
 * HEIGHT MAP (same as v3)
 * ------------------------------------------------------------- */

export const HEIGHT_CLASSES: Record<InputHeight, string> = {
  sm: "h-8",
  md: "h-9",
  lg: "h-10",
  xl: "h-11",
  auto: "h-auto",
};

const DEFAULT_HEIGHTS: Partial<Record<FormFieldType, InputHeight>> = {
  [FormFieldType.INPUT]: "md",
  [FormFieldType.PASSWORD]: "md",
  [FormFieldType.TEXTAREA]: "auto",
  [FormFieldType.DATE_PICKER]: "md",
  [FormFieldType.SELECT]: "md",
  [FormFieldType.SINGLE_SELECT]: "md",
  [FormFieldType.COMMAND]: "md",
  [FormFieldType.PHONE_INPUT]: "md",
  [FormFieldType.CHECKBOX]: "auto",
  [FormFieldType.HIDDEN]: "auto",
  [FormFieldType.SKELETON]: "auto",
  [FormFieldType.CURRENCY]: "md",
  [FormFieldType.PERCENT]: "md",
  [FormFieldType.MASKED]: "md",
  [FormFieldType.ASYNC_SELECT]: "md",
};

/* -------------------------------------------------------------
 * MAIN COMPONENT
 * ------------------------------------------------------------- */

export const DynamicRenderInput = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  field,
  props,
}: RenderInputProps<TFieldValues, TName>) => {
  const {
    fieldType,
    prefix,
    suffix,
    className,
    disabled,
    height,
    inputClassName,
  } = props;

  const heightClass =
    HEIGHT_CLASSES[height || DEFAULT_HEIGHTS[fieldType] || "md"];

  const groupClass = cn(
    "w-full flex rounded-md border border-border transition-all",
    "focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary",
    "hover:border-ring/80",
    disabled && "opacity-60 cursor-not-allowed",
    heightClass,
    className
  );

  const inputClasses = cn(
    "w-full bg-transparent text-sm placeholder:text-muted-foreground/60",
    "border-0 focus-visible:ring-0 focus-visible:ring-offset-0 outline-none",
    inputClassName
  );

  /* -------------------------------------------------------------
   * SPECIAL NON-INPUTGROUP TYPES
   * ------------------------------------------------------------- */

  if (fieldType === FormFieldType.CHECKBOX) {
    return (
      <FormControl>
        <div className="flex items-center gap-2">
          <Checkbox
            id={field.name}
            checked={!!field.value}
            onCheckedChange={field.onChange}
            disabled={disabled}
          />
          {props.label && <label className="text-sm">{props.label}</label>}
        </div>
      </FormControl>
    );
  }

  if (fieldType === FormFieldType.HIDDEN) {
    return <input type="hidden" {...field} value={field.value ?? ""} />;
  }

  if (fieldType === FormFieldType.SKELETON) {
    return props.renderSkeleton ? (
      props.renderSkeleton(field)
    ) : (
      <LazySkeleton className={HEIGHT_CLASSES[props.height ?? "md"]} />
    );
  }

  /* -------------------------------------------------------------
   * BUILD controlChild (inside InputGroup)
   * ------------------------------------------------------------- */

  let controlChild: React.ReactNode = null;

  switch (fieldType) {
    /* ---------------- TEXTAREA ---------------- */
    case FormFieldType.TEXTAREA:
      controlChild = (
        <InputGroupTextarea
          {...props.textareaProps}
          {...field}
          disabled={disabled ?? props.textareaProps?.disabled}
          placeholder={
            props.placeholder ?? props.textareaProps?.placeholder ?? ""
          }
          className={cn(
            "resize-none py-1",
            inputClasses,
            props.textareaProps?.className
          )}
        />
      );
      break;

    /* ---------------- PASSWORD ---------------- */
    case FormFieldType.PASSWORD:
      controlChild = (
        <LazyPassword
          {...props.passwordProps}
          {...field}
          disabled={disabled ?? props.passwordProps?.disabled}
          placeholder={
            props.passwordProps?.placeholder ?? props.placeholder ?? ""
          }
          className={cn(inputClasses, props.passwordProps?.className)}
        />
      );
      break;

    /* ---------------- DATE PICKER ---------------- */
    case FormFieldType.DATE_PICKER:
      controlChild = (
        <LazyDatePicker
          {...props}
          value={field.value}
          onChange={field.onChange}
          disabled={disabled}
          inputClassName={inputClasses}
        />
      );
      break;

    /* ---------------- PHONE INPUT ---------------- */
    case FormFieldType.PHONE_INPUT:
      controlChild = (
        <LazyPhoneInput
          {...field}
          placeholder={props.placeholder}
          disabled={disabled}
          className={cn(inputClasses, "text-right border-none h-full w-full")}
          defaultCountry="PH"
        />
      );
      break;

    /* ---------------- SELECT / SINGLE SELECT ---------------- */
    case FormFieldType.SELECT:
    case FormFieldType.SINGLE_SELECT:
      controlChild = (
        <LazySingleSelector
          field={field}
          data={props.data ?? []}
          label={props.label ?? ""}
          placeholder={props.placeholder}
          disabled={disabled}
          labelKey={props.labelKey ?? "label"}
          valueKey={props.valueKey ?? "value"}
          className={inputClasses}
        />
      );
      break;

    /* ---------------- COMMAND (SelectInput) ---------------- */
    case FormFieldType.COMMAND:
      controlChild = (
        <LazySelectInput
          field={field}
          data={props.data ?? []}
          label={props.label ?? ""}
          placeholder={props.placeholder}
          disabled={disabled}
          labelKey={props.labelKey ?? "label"}
          valueKey={props.valueKey ?? "value"}
          className={inputClasses}
        />
      );
      break;

    /* ---------------- ASYNC SELECT ---------------- */
    case FormFieldType.ASYNC_SELECT: {
      type Row = Record<string, unknown>;

      const asyncData = props.data ? ([...props.data] as Row[]) : undefined;

      const valueKey: StringKeyOf<Row> =
        (props.valueKey as StringKeyOf<Row>) ?? ("value" as StringKeyOf<Row>);

      const labelKey: SelectLabelKey<Row> =
        (props.selectLabelKey as SelectLabelKey<Row>) ?? "label";

      controlChild = (
        <LazyAsyncSelect
          value={field.value}
          onChange={field.onChange}
          data={asyncData}
          loadOptions={props.loadOptions}
          placeholder={props.placeholder}
          disabled={disabled}
          height={height || DEFAULT_HEIGHTS[fieldType] || "md"}
          valueKey={valueKey}
          selectLabelKey={labelKey}
          debounceTime={props.debounceTime ?? 300}
          onAddNew={props.onAddNew}
          addNewLabel={props.addNewLabel}
          borderless={props.borderless}
          iconSearch={props.iconSearch ?? false}
        />
      );
      break;
    }

    /* ---------------- CURRENCY ---------------- */
    case FormFieldType.CURRENCY: {
      const lazy = toLazyFieldProps(field, props);

      controlChild = (
        <LazzyCurrencyInput
          {...lazy}
          disabled={disabled}
          className= {cn(inputClasses, props.className)}
        />
      );
      break;
    }

    /* ---------------- PERCENT ---------------- */

    case FormFieldType.PERCENT: {
      const lazy = toLazyFieldProps(field, props);

      controlChild = (
        <LazzyPercentInput
          {...lazy}
          disabled={disabled}
          className={cn(inputClasses, props.className)}
        />
      );
      break;
    }

    /* ---------------- MASKED ---------------- */
    case FormFieldType.MASKED:
      controlChild = (
        <InputGroupInput
          {...props.inputProps}
          {...field}
          disabled={disabled ?? props.inputProps?.disabled}
          placeholder={
            props.maskPlaceholder ??
            props.placeholder ??
            props.inputProps?.placeholder ??
            ""
          }
          className={cn(inputClasses, props.inputProps?.className)}
          value={applyMask(field.value ?? "", props.mask ?? "")}
          onChange={(e) =>
            field.onChange(applyMask(e.target.value, props.mask ?? ""))
          }
        />
      );
      break;

    /* ---------------- DEFAULT INPUT (FormFieldType.INPUT, fallback) ---------------- */
    default:
      controlChild = (
        <InputGroupInput
          {...props.inputProps}
          {...field}
          type={props.inputProps?.type ?? props.type ?? "text"}
          disabled={disabled ?? props.inputProps?.disabled}
          placeholder={props.placeholder ?? props.inputProps?.placeholder ?? ""}
          className={cn(inputClasses, props.inputProps?.className)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if ((props.type ?? props.inputProps?.type) === "number") {
              const val =
                e.target.value === "" ? undefined : Number(e.target.value);
              field.onChange(val);
            } else {
              field.onChange(e);
            }
          }}
          value={field.value ?? ""}
        />
      );
  }

  /* -------------------------------------------------------------
   * FINAL RENDER WITH INPUTGROUP
   * ------------------------------------------------------------- */

  return (
    <InputGroup className={groupClass}>
      {prefix && (
        <InputGroupText className="px-2 text-muted-foreground text-xs">
          {prefix}
        </InputGroupText>
      )}

      <FormControl className="flex-1 h-full">{controlChild}</FormControl>

      {suffix && (
        <InputGroupText className="px-2 text-muted-foreground text-xs">
          {suffix}
        </InputGroupText>
      )}
    </InputGroup>
  );
};
