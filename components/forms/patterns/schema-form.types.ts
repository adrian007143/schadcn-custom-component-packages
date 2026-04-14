import type {
  DefaultValues,
  FieldPath,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";
import type { ReactNode } from "react";
import type { ZodType } from "zod";

import type { FieldRendererProps } from "@/components/forms/core";

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

export type SchemaFieldConfig<
  T extends FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
  TRow extends Record<string, unknown> = Record<string, unknown>
> = Omit<FieldRendererProps<T, TName, TRow>, "control">;

export interface SchemaSectionConfig<
  T extends FieldValues,
  TRow extends Record<string, unknown> = Record<string, unknown>
> {
  title?: string;
  description?: string;
  layout?: SectionLayout;
  columns?: number;
  fields: SchemaFieldConfig<T, FieldPath<T>, TRow>[];
}

export interface FormActionConfig<T extends FieldValues> {
  label: string;
  submit?: boolean;
  className?: string;
  loadingLabel?: string;
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost";
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  onSubmit?: (values: T, form: UseFormReturn<T>) => void | Promise<void>;
}

export interface SchemaFormProps<
  T extends FieldValues,
  TRow extends Record<string, unknown> = Record<string, unknown>
> {
  schema: ZodType<T>;
  defaultValues: DefaultValues<T>;
  formType?: CRUDFormType;
  sections: SchemaSectionConfig<T, TRow>[];
  buttons: Record<string, FormActionConfig<T>>;
  buttonLayout?: ButtonLayout;
  recaptcha?: boolean;
  className?: string;
}

/** @deprecated Use SchemaFieldConfig instead. */
export type FormBuilderField<T extends FieldValues> = SchemaFieldConfig<T>;
/** @deprecated Use SchemaSectionConfig instead. */
export type FormBuilderSection<T extends FieldValues> = SchemaSectionConfig<T>;
/** @deprecated Use FormActionConfig instead. */
export type FormBuilderButton<T extends FieldValues> = FormActionConfig<T>;
/** @deprecated Use SchemaFormProps instead. */
export type FormBuilderStandardProps<T extends FieldValues> = SchemaFormProps<T>;
