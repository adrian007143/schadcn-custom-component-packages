"use client";

import type { ReactNode } from "react";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

type FieldGroupProps = {
  label?: string;
  error?: string;
  description?: string;
  orientation?: "horizontal" | "vertical" | "responsive" | null | undefined;
  children: ReactNode;
  className?: string;
};

export function FieldGroup({
  label,
  error,
  description,
  children,
  orientation,
  className,
}: FieldGroupProps) {
  return (
    <Field className={className ?? "space-y-1.5"} orientation={orientation}>
      {label && <FieldLabel>{label}</FieldLabel>}
      {children}
      {description && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}

/** @deprecated Use FieldGroup instead. */
export function FormFieldWrapper(props: FieldGroupProps) {
  return <FieldGroup {...props} />;
}
