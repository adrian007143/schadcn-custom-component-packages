"use client";

import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";

export function FormFieldWrapper({
  label,
  error,
  description,
  children,
  orientation
}: {
  label?: string;
  error?: string;
  description?: string;
  orientation?: "horizontal" | "vertical" | "responsive" | null | undefined;
  children: React.ReactNode;
}) {
  return (
    <Field className="space-y-1.5" orientation={orientation}>
      {label && <FieldLabel>{label}</FieldLabel>}
      {children}
      {description && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
