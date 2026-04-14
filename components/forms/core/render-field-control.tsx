"use client";

import React from "react";
import { FieldPath, FieldValues } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import {
  InputGroup,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

import { FormFieldType } from "./constants";
import { FieldSkeleton } from "./FieldSkeleton";
import { applyMask } from "../fields/utils/mask";
import { AsyncSelectField } from "../fields/controls/AsyncSelectField";
import { CurrencyField } from "../fields/controls/CurrencyField";
import { DateField } from "../fields/controls/DateField";
import { MultiSelectField } from "../fields/controls/MultiSelectField";
import { NumberField } from "../fields/controls/NumberField";
import { OtpField } from "../fields/controls/OtpField";
import { PasswordField } from "../fields/controls/PasswordField";
import { PercentField } from "../fields/controls/PercentField";
import { PhoneField } from "../fields/controls/PhoneField";
import { ComboboxField } from "../fields/controls/ComboboxField";
import { RadioGroupField } from "../fields/controls/RadioGroupField";
import { SearchSelect } from "../fields/controls/SearchSelect";
import { SliderField } from "../fields/controls/SliderField";
import {
  FieldControlProps,
  InputHeight,
  SelectLabelKey,
  StringKeyOf,
} from "./types";

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
  [FormFieldType.NUMBER]: "md",
  [FormFieldType.DATE_PICKER]: "md",
  [FormFieldType.SELECT]: "md",
  [FormFieldType.SINGLE_SELECT]: "md",
  [FormFieldType.MULTI_SELECT]: "md",
  [FormFieldType.COMMAND]: "md",
  [FormFieldType.RADIO_GROUP]: "auto",
  [FormFieldType.SLIDER]: "auto",
  [FormFieldType.OTP]: "auto",
  [FormFieldType.PHONE_INPUT]: "md",
  [FormFieldType.CHECKBOX]: "auto",
  [FormFieldType.HIDDEN]: "auto",
  [FormFieldType.SKELETON]: "auto",
  [FormFieldType.CURRENCY]: "md",
  [FormFieldType.PERCENT]: "md",
  [FormFieldType.MASKED]: "md",
  [FormFieldType.ASYNC_SELECT]: "md",
  [FormFieldType.SWITCH]: "auto",
  [FormFieldType.FILE_UPLOAD]: "auto",
};

export const FieldControlRenderer = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TRow extends Record<string, unknown> = Record<string, unknown>
>({
  field,
  fieldId,
  descriptionId,
  messageId,
  invalid,
  props,
}: FieldControlProps<TFieldValues, TName, TRow>) => {
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
  const describedBy = invalid
    ? [descriptionId, messageId].filter(Boolean).join(" ")
    : descriptionId;
  const groupClass = cn(
    "flex w-full items-center rounded-md border border-border bg-background transition-colors",
    "focus-within:border-primary/70 focus-within:ring-1 focus-within:ring-primary/30",
    "hover:border-muted-foreground/40 data-[invalid=true]:border-destructive/60",
    disabled && "cursor-not-allowed opacity-60",
    heightClass,
    className
  );
  const inputClasses = cn(
    "w-full bg-transparent text-sm leading-none",
    "placeholder:text-muted-foreground/60",
    "border-0 outline-none",
    "focus-visible:ring-0 focus-visible:ring-offset-0",
    inputClassName
  );

  if (fieldType === FormFieldType.CHECKBOX) {
    return (
      <Checkbox
        id={fieldId}
        checked={!!field.value}
        onCheckedChange={(checked) => field.onChange(checked)}
        disabled={disabled}
        aria-invalid={invalid}
        aria-describedby={describedBy || undefined}
        aria-label={props.hideLabel ? props.label : undefined}
      />
    );
  }

  if (fieldType === FormFieldType.HIDDEN) {
    return <input type="hidden" {...field} value={field.value ?? ""} />;
  }

  if (fieldType === FormFieldType.RADIO_GROUP) {
    return (
      <RadioGroupField
        field={field}
        fieldId={fieldId}
        descriptionId={descriptionId}
        messageId={messageId}
        invalid={invalid}
        props={props}
      />
    );
  }

  if (fieldType === FormFieldType.SLIDER) {
    return (
      <SliderField
        field={field}
        fieldId={fieldId}
        descriptionId={descriptionId}
        messageId={messageId}
        invalid={invalid}
        props={props}
      />
    );
  }

  if (fieldType === FormFieldType.OTP) {
    return (
      <OtpField
        field={field}
        fieldId={fieldId}
        descriptionId={descriptionId}
        messageId={messageId}
        invalid={invalid}
        props={props}
      />
    );
  }

  if (fieldType === FormFieldType.SKELETON) {
    return props.renderSkeleton ? (
      props.renderSkeleton(field)
    ) : (
      <FieldSkeleton className={HEIGHT_CLASSES[props.height ?? "md"]} />
    );
  }

  if (fieldType === FormFieldType.SWITCH) {
    return (
      <Switch
        {...props.switchProps}
        id={fieldId}
        checked={!!field.value}
        onCheckedChange={(checked) => field.onChange(checked)}
        disabled={disabled}
        aria-invalid={invalid}
        aria-describedby={describedBy || undefined}
        aria-label={props.hideLabel ? props.label : undefined}
      />
    );
  }

  if (fieldType === FormFieldType.FILE_UPLOAD) {
    return (
      <Input
        {...props.inputProps}
        id={fieldId}
        name={field.name}
        type="file"
        disabled={disabled ?? props.inputProps?.disabled}
        aria-invalid={invalid}
        aria-describedby={describedBy || undefined}
        className={cn("cursor-pointer", props.inputProps?.className)}
        onBlur={field.onBlur}
        onChange={(event) => {
          const files = event.target.files;
          field.onChange(props.inputProps?.multiple ? files : files?.[0] ?? null);
        }}
      />
    );
  }

  let controlChild: React.ReactNode = null;

  switch (fieldType) {
    case FormFieldType.TEXTAREA:
      controlChild = (
        <InputGroupTextarea
          {...props.textareaProps}
          {...field}
          id={fieldId}
          disabled={disabled ?? props.textareaProps?.disabled}
          placeholder={props.placeholder ?? props.textareaProps?.placeholder ?? ""}
          aria-invalid={invalid}
          aria-describedby={describedBy || undefined}
          className={cn(
            "resize-none py-1",
            inputClasses,
            props.textareaProps?.className
          )}
        />
      );
      break;

    case FormFieldType.PASSWORD:
      controlChild = (
        <PasswordField
          {...props.passwordProps}
          {...field}
          id={fieldId}
          disabled={disabled ?? props.passwordProps?.disabled}
          placeholder={props.passwordProps?.placeholder ?? props.placeholder ?? ""}
          aria-invalid={invalid}
          aria-describedby={describedBy || undefined}
          className={cn(inputClasses, props.passwordProps?.className)}
        />
      );
      break;

    case FormFieldType.DATE_PICKER:
      controlChild = (
        <DateField
          value={field.value}
          onChange={field.onChange}
          placeholder={props.placeholder}
          disabled={disabled}
          className="w-full"
          inputClassName={inputClasses}
          inputId={fieldId}
          ariaInvalid={invalid}
          ariaDescribedBy={describedBy || undefined}
        />
      );
      break;

    case FormFieldType.PHONE_INPUT:
      controlChild = (
        <PhoneField
          {...field}
          id={fieldId}
          placeholder={props.placeholder}
          disabled={disabled}
          aria-invalid={invalid}
          aria-describedby={describedBy || undefined}
          className={cn(inputClasses, "h-full w-full border-none text-right")}
        />
      );
      break;

    case FormFieldType.SELECT:
    case FormFieldType.SINGLE_SELECT:
      controlChild = (
        <SearchSelect
          field={field}
          data={props.data ?? []}
          label={props.label ?? ""}
          placeholder={props.placeholder}
          disabled={disabled}
          labelKey={props.labelKey ?? "label"}
          valueKey={props.valueKey ?? "value"}
          inputId={fieldId}
          ariaInvalid={invalid}
          ariaDescribedBy={describedBy || undefined}
          className={inputClasses}
        />
      );
      break;

    case FormFieldType.MULTI_SELECT:
      controlChild = (
        <MultiSelectField
          field={field}
          fieldId={fieldId}
          descriptionId={descriptionId}
          messageId={messageId}
          invalid={invalid}
          props={props}
        />
      );
      break;

    case FormFieldType.COMMAND:
      controlChild = (
        <ComboboxField
          field={field}
          data={props.data ?? []}
          label={props.label ?? ""}
          placeholder={props.placeholder}
          disabled={disabled}
          labelKey={props.labelKey ?? "label"}
          valueKey={props.valueKey ?? "value"}
          inputId={fieldId}
          ariaInvalid={invalid}
          ariaDescribedBy={describedBy || undefined}
          className={inputClasses}
        />
      );
      break;

    case FormFieldType.NUMBER:
      controlChild = (
        <NumberField
          field={field}
          fieldId={fieldId}
          descriptionId={descriptionId}
          messageId={messageId}
          invalid={invalid}
          props={props}
        />
      );
      break;

    case FormFieldType.ASYNC_SELECT: {
      type Row = Record<string, unknown>;
      const asyncData = props.data as Row[] | undefined;
      const valueKey: StringKeyOf<Row> =
        (props.valueKey as StringKeyOf<Row>) ?? ("value" as StringKeyOf<Row>);
      const labelKey: SelectLabelKey<Row> =
        (props.selectLabelKey as SelectLabelKey<Row>) ?? "label";

      controlChild = (
        <AsyncSelectField
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
          iconSearch={props.iconSearch ?? false}
        />
      );
      break;
    }

    case FormFieldType.CURRENCY:
      controlChild = (
        <CurrencyField
          field={field as never}
          props={props as never}
          disabled={disabled}
          className={cn(
            inputClasses,
            "text-right tabular-nums",
            props.className
          )}
        />
      );
      break;

    case FormFieldType.PERCENT:
      controlChild = (
        <PercentField
          field={field}
          props={props}
          disabled={disabled}
          className={cn(inputClasses, props.className)}
        />
      );
      break;

    case FormFieldType.MASKED:
      controlChild = (
        <InputGroupInput
          {...props.inputProps}
          {...field}
          id={fieldId}
          disabled={disabled ?? props.inputProps?.disabled}
          placeholder={
            props.maskPlaceholder ??
            props.placeholder ??
            props.inputProps?.placeholder ??
            ""
          }
          aria-invalid={invalid}
          aria-describedby={describedBy || undefined}
          className={cn(inputClasses, props.inputProps?.className)}
          value={applyMask(field.value ?? "", props.mask ?? "")}
          onChange={(event) => {
            const next = applyMask(event.target.value, props.mask ?? "");
            if (next !== field.value) {
              field.onChange(next);
            }
          }}
        />
      );
      break;

    default:
      controlChild = (
        <InputGroupInput
          {...props.inputProps}
          {...field}
          id={fieldId}
          type={props.inputProps?.type ?? props.type ?? "text"}
          disabled={disabled ?? props.inputProps?.disabled}
          placeholder={props.placeholder ?? props.inputProps?.placeholder ?? ""}
          aria-invalid={invalid}
          aria-describedby={describedBy || undefined}
          className={cn(inputClasses, props.inputProps?.className)}
          onChange={(event) => {
            if ((props.type ?? props.inputProps?.type) === "number") {
              field.onChange(
                event.target.value === "" ? "" : Number(event.target.value)
              );
              return;
            }

            field.onChange(event);
          }}
        />
      );
  }

  return (
    <InputGroup data-invalid={invalid || undefined} className={groupClass}>
      {prefix && (
        <InputGroupText className="bg-muted/30 px-2 text-xs text-muted-foreground/70">
          {prefix}
        </InputGroupText>
      )}

      <div className="h-full flex-1">{controlChild}</div>

      {suffix && (
        <InputGroupText className="px-2 text-xs text-muted-foreground">
          {suffix}
        </InputGroupText>
      )}
    </InputGroup>
  );
};

/** @deprecated Use FieldControlRenderer instead. */
export const DynamicRenderInput = FieldControlRenderer;
