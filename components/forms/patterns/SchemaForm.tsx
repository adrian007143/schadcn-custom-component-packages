"use client";

import { useState } from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";

import { FieldRenderer, type FieldColSpan } from "@/components/forms/core";
import { Button } from "@/components/ui/button";
import { FieldSeparator } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { typedZodResolver } from "@/lib/utils/typedZodResolver";

import ReCAPTCHAField from "./ReCAPTCHAField";
import type { SchemaFormProps, SectionLayout } from "./schema-form.types";

function getSectionLayoutClass(layout?: SectionLayout, columns?: number) {
  switch (layout) {
    case "grid-2":
      return "grid grid-cols-1 gap-4 sm:grid-cols-2";
    case "grid-3":
      return "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";
    case "grid-4":
      return "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4";
    case "grid-6":
      return "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6";
    case "auto-fit":
      return "grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]";
    case "grid": {
      const safeColumns = Math.min(Math.max(columns ?? 2, 1), 6);

      switch (safeColumns) {
        case 1:
          return "grid grid-cols-1 gap-4";
        case 2:
          return "grid grid-cols-1 gap-4 sm:grid-cols-2";
        case 3:
          return "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";
        case 4:
          return "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4";
        case 5:
          return "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5";
        case 6:
        default:
          return "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6";
      }
    }
    default:
      return "flex flex-col gap-5";
  }
}

function getFieldSpanClass(
  layout: SectionLayout | undefined,
  columns: number | undefined,
  colSpan: FieldColSpan | undefined
) {
  if (!colSpan || colSpan === 1 || layout === "stack") {
    return "";
  }

  if (colSpan === "full") {
    return "col-span-full";
  }

  if (layout === "auto-fit") {
    return "";
  }

  const getGridClass = (maxColumns: number) => {
    const safeSpan = Math.min(colSpan, maxColumns);

    switch (safeSpan) {
      case 2:
        return "sm:col-span-2";
      case 3:
        return "sm:col-span-2 lg:col-span-3";
      case 4:
        return "sm:col-span-2 lg:col-span-4";
      default:
        return "";
    }
  };

  switch (layout) {
    case "grid-2":
      return getGridClass(2);
    case "grid-3":
      return getGridClass(3);
    case "grid-4":
      return getGridClass(4);
    case "grid-6":
      return colSpan === 2
        ? "col-span-2"
        : colSpan === 3
        ? "col-span-2 sm:col-span-3"
        : "col-span-2 sm:col-span-3 lg:col-span-4";
    case "grid":
      return getGridClass(Math.min(Math.max(columns ?? 2, 1), 6));
    default:
      return "";
  }
}

export function SchemaForm<
  T extends FieldValues,
  TRow extends Record<string, unknown> = Record<string, unknown>
>({
  schema,
  defaultValues,
  formType = "CREATE",
  sections,
  buttons,
  buttonLayout = "stack",
  recaptcha = false,
  className,
}: SchemaFormProps<T, TRow>) {
  const form = useForm<T>({
    resolver: typedZodResolver(schema),
    defaultValues,
  });

  const isSubmitting = form.formState.isSubmitting;
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleSubmit = (buttonKey: string | null) => async (values: T) => {
    if (formType === "VIEW" || (recaptcha && !captchaToken) || !buttonKey) {
      return;
    }

    const button = buttons[buttonKey];
    if (!button?.onSubmit) {
      return;
    }

    await button.onSubmit(values, form);

    if (formType === "CREATE") {
      form.reset(defaultValues);
    }
  };

  const buttonLayoutClass =
    buttonLayout === "stack"
      ? "flex flex-col gap-3"
      : buttonLayout === "right"
      ? "flex flex-wrap justify-end gap-3"
      : buttonLayout === "space-between"
      ? "flex flex-wrap justify-between gap-3"
      : "flex flex-wrap gap-3";

  return (
    <FormProvider {...form}>
      <form
        className={className}
        noValidate
        onSubmit={(event) => {
          event.preventDefault();

          const submitter = (event.nativeEvent as SubmitEvent)
            .submitter as HTMLButtonElement | null;
          const buttonKey = submitter?.name ?? null;

          setActiveButton(buttonKey);
          form.handleSubmit(handleSubmit(buttonKey))();
        }}
      >
        <div className="space-y-8">
          {sections.map((section, index) => (
            <section key={index} className="space-y-4">
              {section.title ? (
                <h3 className="text-lg font-semibold">{section.title}</h3>
              ) : null}
              {section.description ? (
                <p className="text-sm text-muted-foreground">
                  {section.description}
                </p>
              ) : null}
              <div
                className={getSectionLayoutClass(
                  section.layout,
                  section.columns
                )}
              >
                {section.fields.map((field) => (
                  <div
                    key={String(field.name)}
                    className={getFieldSpanClass(
                      section.layout,
                      section.columns,
                      field.colSpan
                    )}
                  >
                    <FieldRenderer control={form.control} {...field} />
                  </div>
                ))}
              </div>
            </section>
          ))}

          {recaptcha ? <ReCAPTCHAField onVerify={setCaptchaToken} /> : null}

          <FieldSeparator className="mb-2" />

          <div
            className={
              buttonLayout === "stack"
                ? "flex flex-col gap-3"
                : "flex flex-wrap justify-end gap-3"
            }
          >
            <div className={buttonLayoutClass}>
              {Object.entries(buttons).map(([key, button]) => {
                const isLoading = isSubmitting && activeButton === key;
                const shouldFillWidth = buttonLayout === "stack";

                return (
                  <Button
                    key={key}
                    name={key}
                    type={button.submit ? "submit" : "button"}
                    variant={button.variant ?? "default"}
                    disabled={isSubmitting}
                    className={cn(
                      "flex min-w-0 cursor-pointer items-center justify-center gap-2",
                      shouldFillWidth ? "w-full" : "w-full sm:w-auto",
                      button.className
                    )}
                  >
                    {isLoading ? (
                      button.loadingLabel ?? "Processing..."
                    ) : (
                      <span className="flex items-center gap-2">
                        {button.iconLeft}
                        {button.label}
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

/** @deprecated Use SchemaForm instead. */
export const FormBuilderStandard = SchemaForm;
