import type {
  FieldPath,
  FieldValues,
  UseFormReturn,
  DefaultValues,
} from "react-hook-form";
import type { ReactNode } from "react";
import type { ZodType } from "zod";
import { FormFieldType } from "@/components/forms/form-field";

export type CRUDFormType = "CREATE" | "UPDATE" | "VIEW";

export type SectionLayout =
  | "stack"
  | "grid"
  | "grid-2"
  | "grid-3"
  | "grid-4"
  | "grid-6"
  | "auto-fit";

export type ButtonLayout = "stack" | "inline" | "right" | "space-between";

export interface FormBuilderField<T extends FieldValues> {
  name: FieldPath<T>;
  fieldType: FormFieldType;
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  height?: "sm" | "md" | "lg" | "xl" | "auto";
  icon?: ReactNode;

  data?: Record<string, unknown>[];
  labelKey?: string;
  valueKey?: string;
}

export interface FormBuilderSection<T extends FieldValues> {
  title?: string;
  description?: string;
  layout?: SectionLayout;
  columns?: number; // 👈 needed for "grid"
  fields: FormBuilderField<T>[];
}

export interface FormBuilderButton<T extends FieldValues> {
  label: string;
  submit?: boolean;
  className?: string;
  loadingLabel?: string;
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost";
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  onSubmit?: (values: T, form: UseFormReturn<T>) => void | Promise<void>;
}

export interface FormBuilderStandardProps<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: DefaultValues<T>;
  formType?: CRUDFormType;
  sections: FormBuilderSection<T>[];
  buttons: Record<string, FormBuilderButton<T>>;
  buttonLayout?: ButtonLayout;
  recaptcha?: boolean;
  className?: string;
}
