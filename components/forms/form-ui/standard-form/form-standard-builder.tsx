"use client";

import React, { useState } from "react";
import {
  useForm,
  FieldValues,
  SubmitHandler,
  DefaultValues,
  FieldPath,
} from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";

// ⛔️ DO NOT use FieldGroup (it nests forms)
import { FieldSeparator } from "@/components/ui/field";

import { DynamicFormField, FormFieldType } from "@/components/forms/form-field";
import { typedZodResolver } from "@/lib/utils/typedZodResolver";

import {
  FormNamedButtons,
  type ButtonLayout,
} from "@/components/forms/form-ui/form-utils/FormNamedButtons";

import { NamedFormButton } from "@/components/forms/form-ui/form-utils/NamedButtons";
import { showError } from "@/lib/helper/toast-icon";
import ReCAPTCHAComponent from "../form-utils/ReCAPTCHAComponent";

/* --------------------------------------------------
 * TYPES
 * -------------------------------------------------- */

export type CRUDFormType = "CREATE" | "UPDATE" | "DELETE" | "VIEW";

export type FormSectionLayout =
  | "stack"
  | "grid-2"
  | "grid-3"
  | "grid-4"
  | "grid-6"
  | "auto-fit"
  | "grid";

export interface FormFieldConfig<TValues extends FieldValues> {
  name: FieldPath<TValues>;
  fieldType: FormFieldType;
  label?: string;
  placeholder?: string;
  height?: "sm" | "md" | "lg" | "xl" | "auto";
  required?: boolean;
  disabled?: boolean;
  description?: string;
  icon?: React.ReactNode;
  data?: Record<string, unknown>[];
  labelKey?: string;
  valueKey?: string;
}

export interface FormSection<TValues extends FieldValues> {
  title?: string;
  description?: string;
  layout?: FormSectionLayout;
  columns?: number;
  fields: FormFieldConfig<TValues>[];
}

export interface FormBuilderProps<TValues extends FieldValues> {
  schema: z.ZodType<TValues>;
  defaultValues: DefaultValues<TValues>;
  formType?: CRUDFormType;
  fields?: FormFieldConfig<TValues>[];
  sections?: FormSection<TValues>[];
  onSubmit?: (values: TValues) => Promise<void> | void;
  recaptcha?: boolean;
  className?: string;
  buttons?: Record<string, NamedFormButton<TValues> | undefined>;
  buttonLayout?: ButtonLayout;
  stickyFooter?: boolean;
}

/* --------------------------------------------------
 * LAYOUT HELPER
 * -------------------------------------------------- */

function getSectionLayoutClass(layout?: FormSectionLayout, columns?: number) {
  switch (layout) {
    case "grid-2":
      return "grid grid-cols-1 sm:grid-cols-2 gap-4";
    case "grid-3":
      return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4";
    case "grid-4":
      return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4";
    case "grid-6":
      return "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4";
    case "auto-fit":
      return "grid [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))] gap-4";
    case "grid": {
      const c = Math.min(Math.max(columns ?? 2, 1), 6);
      return `grid grid-cols-1 sm:grid-cols-${Math.min(
        c,
        2
      )} lg:grid-cols-${c} gap-4`;
    }
    default:
      return "flex flex-col gap-5";
  }
}

/* --------------------------------------------------
 * COMPONENT
 * -------------------------------------------------- */

export function FormBuilderStandard<TValues extends FieldValues>({
  schema,
  defaultValues,
  formType = "CREATE",
  fields,
  sections,
  onSubmit,
  recaptcha = false,
  className,
  buttons = {},
  buttonLayout = "stack",
  stickyFooter = false,
}: FormBuilderProps<TValues>) {
  const form = useForm<TValues>({
    resolver: typedZodResolver(schema),
    defaultValues,
  });

  const isSubmitting = form.formState.isSubmitting;

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null);
  const [activeButton, setActiveButton] = useState<string | null>(null);

  /* ✅ NOT memoized — compiler safe */
  const handleSubmit: SubmitHandler<TValues> = async (values) => {
    if (formType === "VIEW") return;

    if (recaptcha && !captchaToken) {
      setRecaptchaError("Please verify that you are not a robot.");
      return;
    }
    setRecaptchaError(null);

    try {
      if (activeButton && buttons[activeButton]?.onSubmit) {
        await buttons[activeButton]!.onSubmit!(values, form);
      } else if (onSubmit) {
        await onSubmit(values);
      }

      if (formType === "CREATE") {
        form.reset(defaultValues);
      }

      setCaptchaToken(null);
    } catch (err) {
      showError({
        message: err instanceof Error ? err.message : "Something went wrong",
      });
    }
  };

  const resolvedSections: FormSection<TValues>[] =
    sections ?? (fields ? [{ layout: "stack", fields }] : []);

  const buttonsBlock = (
    <FormNamedButtons
      form={form}
      buttons={buttons}
      isSubmitting={isSubmitting}
      formType={formType}
      activeButton={activeButton}
      setActiveButton={setActiveButton}
      buttonLayout={buttonLayout}
    />
  );

  return (
    <Form {...form}>
      {/* ✅ ONE AND ONLY ONE <form> */}
      <form
        onSubmit={(e) => {
          const submitter = (e.nativeEvent as SubmitEvent)
            .submitter as HTMLButtonElement | null;

          if (submitter?.name) {
            setActiveButton(submitter.name);
          }

          form.handleSubmit(handleSubmit)(e);
        }}
        className={className}
        noValidate
      >
        <div className="p-4 space-y-8">
          {resolvedSections.map((section, index) => (
            <section key={index} className="space-y-4">
              {section.title && (
                <h3 className="text-lg font-semibold">{section.title}</h3>
              )}
              {section.description && (
                <p className="text-sm text-muted-foreground">
                  {section.description}
                </p>
              )}

              <div
                className={getSectionLayoutClass(
                  section.layout,
                  section.columns
                )}
              >
                {section.fields.map((f) => (
                  <DynamicFormField
                    key={f.name}
                    control={form.control}
                    name={f.name}
                    fieldType={f.fieldType}
                    label={f.label}
                    placeholder={f.placeholder}
                    description={f.description}
                    required={f.required}
                    disabled={f.disabled || formType === "VIEW" || isSubmitting}
                    height={f.height}
                    prefix={f.icon}
                    data={f.data}
                    labelKey={f.labelKey}
                    valueKey={f.valueKey}
                  />
                ))}
              </div>
            </section>
          ))}

          {recaptcha && formType !== "VIEW" && (
            <div className="flex flex-col gap-2">
              <ReCAPTCHAComponent
                onVerify={(token) => {
                  setCaptchaToken(token);
                  setRecaptchaError(null);
                }}
              />
              {recaptchaError && (
                <p className="text-sm text-destructive">{recaptchaError}</p>
              )}
            </div>
          )}

          <FieldSeparator className="mb-2" />

          {stickyFooter ? (
            <div className="sticky bottom-0 bg-background/90 backdrop-blur border-t border-border pt-4">
              {buttonsBlock}
            </div>
          ) : (
            buttonsBlock
          )}
        </div>
      </form>
    </Form>
  );
}
