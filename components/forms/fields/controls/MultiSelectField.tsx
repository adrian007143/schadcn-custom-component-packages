"use client";

import { FieldPath, FieldValues } from "react-hook-form";

import { MultiSelect, type MultiSelectOption } from "@/components/ui/multi-select";

import { FieldControlProps, StringKeyOf } from "@/components/forms/core/types";

export function MultiSelectField<
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
}: FieldControlProps<TFieldValues, TName, TRow>) {
  const options = props.data ?? [];
  const labelKey = (props.labelKey ?? "label") as StringKeyOf<
    (typeof options)[number]
  >;
  const valueKey = (props.valueKey ?? "value") as StringKeyOf<
    (typeof options)[number]
  >;
  const describedBy = invalid
    ? [descriptionId, messageId].filter(Boolean).join(" ")
    : descriptionId;

  const normalizedOptions: MultiSelectOption[] = options.map((option) => ({
    label: String(option[labelKey] ?? ""),
    value: String(option[valueKey] ?? ""),
    disabled: Boolean((option as Record<string, unknown>).disabled),
  }));

  return (
    <MultiSelect
      inputId={fieldId}
      value={Array.isArray(field.value) ? field.value.map(String) : []}
      onChange={field.onChange}
      options={normalizedOptions}
      placeholder={props.placeholder}
      disabled={props.disabled}
      maxSelected={props.maxSelected}
      ariaInvalid={invalid}
      ariaDescribedBy={describedBy || undefined}
    />
  );
}
