"use client";

import { useState } from "react";
import { useForm, FieldValues } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DynamicFormField } from "@/components/forms/form-field";
import ReCAPTCHAComponent from "@/components/forms/form-ui/form-utils/ReCAPTCHAComponent";

import type { FormBuilderStandardProps, SectionLayout } from "./types";
import { typedZodResolver } from "@/lib/utils/typedZodResolver";
import { FieldSeparator } from "@/components/ui/field";
import { cn } from "@/lib/utils";

export function FormBuilderStandard<T extends FieldValues>({
  schema,
  defaultValues,
  formType = "CREATE",
  sections,
  buttons,
  buttonLayout = "stack",
  recaptcha = false,
  className,
}: FormBuilderStandardProps<T>) {
  const form = useForm<T>({
    resolver: typedZodResolver(schema),
    defaultValues,
  });

  const isSubmitting = form.formState.isSubmitting;
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [activeButton, setActiveButton] = useState<string | null>(null);

  /**
   * NOTE:
   * buttonKey is passed directly — NOT read from state
   */
  const handleSubmit = (buttonKey: string | null) => async (values: T) => {
    if (formType === "VIEW") return;
    if (recaptcha && !captchaToken) return;
    if (!buttonKey) return;

    const button = buttons[buttonKey];
    if (!button?.onSubmit) return;

    await button.onSubmit(values, form);

    if (formType === "CREATE") {
      form.reset(defaultValues);
    }
  };

  /* --------------------------------------------------
   * SECTION LAYOUT HELPER
   * -------------------------------------------------- */
  function getSectionLayoutClass(layout?: SectionLayout, columns?: number) {
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
   * BUTTON LAYOUT
   * -------------------------------------------------- */

  const buttonLayoutClass =
    buttonLayout === "stack"
      ? "flex flex-col gap-3"
      : buttonLayout === "right"
      ? "flex flex-row justify-end gap-3"
      : buttonLayout === "space-between"
      ? "flex flex-row justify-between gap-3"
      : "flex flex-row gap-3";

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          const submitter = (e.nativeEvent as SubmitEvent)
            .submitter as HTMLButtonElement | null;

          const buttonKey = submitter?.name ?? null;

          // UI only (loading state)
          setActiveButton(buttonKey);

          // ✅ pass buttonKey directly
          form.handleSubmit(handleSubmit(buttonKey))();
        }}
        className={className}
        noValidate
      >
        <div className="space-y-8">
          {sections.map((section, idx) => (
            <section key={idx} className="space-y-4">
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
                {section.fields.map((field) => (
                  <DynamicFormField
                    key={field.name}
                    control={form.control}
                    {...field}
                  />
                ))}
              </div>
            </section>
          ))}

          {recaptcha && <ReCAPTCHAComponent onVerify={setCaptchaToken} />}

          <FieldSeparator className="mb-2" />

          <div
            className={
              buttonLayout === "stack"
                ? "flex flex-col gap-3"
                : "flex flex-row gap-3 justify-end"
            }
          >
            <div className={buttonLayoutClass}>
              {Object.entries(buttons).map(([key, btn]) => {
                const isLoading = isSubmitting && activeButton === key;

                return (
                  <Button
                    key={key}
                    name={key}
                    type={btn.submit ? "submit" : "button"}
                    variant={btn.variant ?? "default"}
                    disabled={isSubmitting}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 cursor-pointer",
                      btn.className
                    )}
                  >
                    {isLoading ? (
                      btn.loadingLabel ?? "Processing..."
                    ) : (
                      <span className="flex items-center gap-2">
                        {btn.iconLeft}
                        {btn.label}
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
