"use client";

import { FieldPath, FieldValues } from "react-hook-form";

import { InputOTP } from "@/components/ui/input-otp";

import { FieldControlProps } from "@/components/forms/core/types";

export function OtpField<
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
  const describedBy = invalid
    ? [descriptionId, messageId].filter(Boolean).join(" ")
    : descriptionId;

  return (
    <InputOTP
      inputId={fieldId}
      value={typeof field.value === "string" ? field.value : ""}
      onChange={field.onChange}
      length={props.otpLength ?? 6}
      disabled={props.disabled}
      invalid={invalid}
      ariaDescribedBy={describedBy || undefined}
      className="px-1 py-0.5"
    />
  );
}
