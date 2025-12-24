"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  useForm,
  FieldValues,
  SubmitHandler,
  DefaultValues,
  FieldPath,
  UseFormReturn,
} from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { FieldGroup, FieldSeparator } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import {
  DynamicFormField as CustomFormField,
  FormFieldType,
  SelectLabelKey,
  StringKeyOf,
} from "@/components/forms/form-field";

import { typedZodResolver } from "@/lib/utils/typedZodResolver";
import { showError } from "@/lib/helper/toast-icon";
import { ArrowLeftIcon, ArrowRightIcon, CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";
import ReCAPTCHAComponent from "../form-utils/ReCAPTCHAComponent";

/* --------------------------------------------------
 * TYPES
 * -------------------------------------------------- */

export type MultiStepFormMode = "CREATE" | "UPDATE";

export type MultiStepFormVariant = "card" | "outline" | "ghost";

export type FormSectionLayout =
  | "stack"
  | "grid-2"
  | "grid-3"
  | "grid-4"
  | "grid-6"
  | "auto-fit"
  | "grid";

export type MultiStepLayoutMode = "auto" | "horizontal" | "vertical";

export interface FormFieldConfig<
  TValues extends FieldValues,
  TRow extends Record<string, unknown> = Record<string, unknown>
> {
  name: FieldPath<TValues>;
  fieldType: FormFieldType;

  label?: string;
  placeholder?: string;
  description?: string;
  height?: "sm" | "md" | "lg" | "xl" | "auto";
  required?: boolean;
  disabled?: boolean;
  type?: string;
  icon?: React.ReactNode;
  data?: TRow[];
  labelKey?: StringKeyOf<TRow>;
  valueKey?: StringKeyOf<TRow>;
  selectLabelKey?: SelectLabelKey<TRow>;

  mask?: string;
  maskPlaceholder?: string;
  className?: string;

  // Additional properties from CustomProps
  hideLabel?: boolean;
  hideDescription?: boolean;
  hideMessage?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  wrapperClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  messageClassName?: string;
  inputProps?: import("react").ComponentProps<"input">;
  textareaProps?: import("react").ComponentProps<"textarea">;
  passwordProps?: import("react").ComponentProps<"input">;
  switchProps?: Record<string, unknown>;
  loadOptions?: (query: string) => Promise<TRow[]>;
  debounceTime?: number;
  onAddNew?: () => void;
  addNewLabel?: string;
  borderless?: boolean;
  iconSearch?: boolean;
  currencyLocale?: string;
  decimalPlaces?: number;
  thousandSeparator?: boolean;
  trimTrailingZeros?: boolean;
  percentDecimalPlaces?: number;
  textAlign?: "left" | "right";
  renderSkeleton?: (
    field: import("react-hook-form").ControllerRenderProps<
      TValues,
      FieldPath<TValues>
    >
  ) => React.ReactNode;
  loaderMode?: "spinner" | "skeleton";
  loaderSize?: "sm" | "md" | "lg";
  loaderRadius?: "none" | "sm" | "md" | "lg";
}

export interface FormSection<
  TValues extends FieldValues,
  TRow extends Record<string, unknown> = Record<string, unknown>
> {
  title?: string;
  description?: string;
  layout?: FormSectionLayout;
  columns?: number;
  fields: FormFieldConfig<TValues, TRow>[];
}

export interface MultiStepFormStep<
  TValues extends FieldValues,
  TRow extends Record<string, unknown> = Record<string, unknown>
> {
  id?: string;
  title: string;
  description?: string;
  sections?: FormSection<TValues, TRow>[];
  fields?: FormFieldConfig<TValues, TRow>[];
  layout?: FormSectionLayout;
  columns?: number;
}

export interface MultiStepFormProps<
  TValues extends FieldValues,
  TRow extends Record<string, unknown> = Record<string, unknown>
> {
  schema: z.ZodType<TValues>;
  defaultValues: DefaultValues<TValues>;
  steps: MultiStepFormStep<TValues, TRow>[];
  onSubmit: (
    values: TValues,
    form: UseFormReturn<TValues>
  ) => Promise<void> | void;
  mode?: MultiStepFormMode;
  onCancel?: () => void;
  recaptcha?: boolean;

  className?: string;
  variant?: MultiStepFormVariant;

  stickyFooter?: boolean;
  showProgressBar?: boolean;
  FormLayout?: FormSectionLayout;
  FormColumns?: number;
  layoutMode?: MultiStepLayoutMode;
}

/* --------------------------------------------------
 * LAYOUT HELPER
 * -------------------------------------------------- */

function getSectionLayoutClass(
  layout: FormSectionLayout,
  columns?: number
): string {
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
      return "grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4";
    case "grid": {
      const safeCols = Math.min(Math.max(columns ?? 2, 1), 6);
      switch (safeCols) {
        case 1:
          return "grid grid-cols-1 gap-4";
        case 2:
          return "grid grid-cols-1 sm:grid-cols-2 gap-4";
        case 3:
          return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4";
        case 4:
          return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4";
        case 5:
          return "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4";
        case 6:
        default:
          return "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4";
      }
    }
    case "stack":
    default:
      return "flex flex-col gap-5";
  }
}

/* --------------------------------------------------
 * PROGRESS BAR
 * -------------------------------------------------- */

function ProgressBar({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  const progress =
    totalSteps <= 1 ? 100 : ((currentStep + 1) / totalSteps) * 100;
  return (
    <div className="space-y-1 mb-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-1.5" />
    </div>
  );
}

/* --------------------------------------------------
 * MAIN COMPONENT
 * -------------------------------------------------- */

export function MultiStepForm<
  TValues extends FieldValues,
  TRow extends Record<string, unknown> = Record<string, unknown>
>({
  schema,
  defaultValues,
  steps,
  onSubmit,
  mode = "CREATE",
  onCancel,
  recaptcha = false,
  className,
  variant = "card",
  stickyFooter = false,
  showProgressBar = true,
  FormLayout,
  FormColumns,
  layoutMode = "auto",
}: MultiStepFormProps<TValues, TRow>) {
  const form = useForm<TValues>({
    resolver: typedZodResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  const isSubmitting = form.formState.isSubmitting;
  const [currentStep, setCurrentStep] = useState(0);
  const [maxVisitedStep, setMaxVisitedStep] = useState(0);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null);

  const totalSteps = steps.length;
  const isLastStep = currentStep === totalSteps - 1;
  const currentStepConfig = steps[currentStep];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  /* -----------------------------------------
   * Styling Variants Logic
   * ----------------------------------------- */
  const variantStyles: Record<MultiStepFormVariant, string> = {
    card: "bg-card rounded-lg border shadow-sm p-6",
    outline: "bg-transparent rounded-lg border p-6",
    ghost: "bg-transparent border-none shadow-none p-0",
  };

  /* -----------------------------------------
   * Logic
   * ----------------------------------------- */

  const stepFieldNames: FieldPath<TValues>[][] = useMemo(() => {
    return steps.map((step) => {
      const sections =
        step.sections ??
        (step.fields
          ? [
              {
                layout: step.layout ?? "stack",
                columns: step.columns,
                fields: step.fields,
              },
            ]
          : []);

      return sections.flatMap((sec) => sec.fields.map((f) => f.name));
    });
  }, [steps]);

  const handleNext = useCallback(async () => {
    const fields = stepFieldNames[currentStep];
    const valid = await form.trigger(fields as FieldPath<TValues>[], {
      shouldFocus: true,
    });

    if (!valid) return;

    const next = Math.min(currentStep + 1, totalSteps - 1);
    setCurrentStep(next);
    setMaxVisitedStep((prev) => Math.max(prev, next));
  }, [currentStep, form, stepFieldNames, totalSteps]);

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleStepClick = useCallback(
    async (targetIndex: number) => {
      if (targetIndex === currentStep) return;

      if (targetIndex < currentStep) {
        setCurrentStep(targetIndex);
        return;
      }

      if (targetIndex <= maxVisitedStep) {
        setCurrentStep(targetIndex);
        return;
      }

      if (targetIndex === currentStep + 1) {
        const fields = stepFieldNames[currentStep];
        const valid = await form.trigger(fields as FieldPath<TValues>[], {
          shouldFocus: true,
        });
        if (!valid) return;

        setCurrentStep(targetIndex);
        setMaxVisitedStep((prev) => Math.max(prev, targetIndex));
      }
    },
    [currentStep, maxVisitedStep, form, stepFieldNames]
  );

  const handleFinalSubmit = useCallback<SubmitHandler<TValues>>(
    async (values) => {
      if (recaptcha && !captchaToken) {
        setRecaptchaError("Please verify that you are not a robot.");
        return;
      }
      setRecaptchaError(null);
      try {
        await onSubmit(values, form);
      } catch (err) {
        showError({
          message: err instanceof Error ? err.message : "Something went wrong",
        });
      }
    },
    [recaptcha, captchaToken, onSubmit, form]
  );

  const formOnSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
    (e) => {
      e.preventDefault();
      if (isLastStep) {
        form.handleSubmit(handleFinalSubmit)(e);
      } else {
        handleNext();
      }
    },
    [form, handleFinalSubmit, isLastStep, handleNext]
  );

  /* -----------------------------------------
   * Render Helpers
   * ----------------------------------------- */

  const renderField = (f: FormFieldConfig<TValues, TRow>) => {
    return (
      <CustomFormField<TValues, FieldPath<TValues>>
        key={f.name}
        control={form.control}
        name={f.name}
        fieldType={f.fieldType}
        label={f.label}
        placeholder={f.placeholder}
        description={f.description}
        required={f.required}
        disabled={f.disabled || isSubmitting}
        type={f.type}
        prefix={f.prefix || f.icon}
        suffix={f.suffix}
        height={f.height ?? "md"}
        data={f.data}
        labelKey={f.labelKey}
        valueKey={f.valueKey}
        selectLabelKey={
          f.selectLabelKey as SelectLabelKey<Record<string, unknown>>
        }
        mask={f.mask}
        maskPlaceholder={f.maskPlaceholder}
        className={f.className}
        // Additional properties
        hideLabel={f.hideLabel}
        hideDescription={f.hideDescription}
        hideMessage={f.hideMessage}
        wrapperClassName={f.wrapperClassName}
        inputClassName={f.inputClassName}
        labelClassName={f.labelClassName}
        descriptionClassName={f.descriptionClassName}
        messageClassName={f.messageClassName}
        inputProps={f.inputProps}
        textareaProps={f.textareaProps}
        passwordProps={f.passwordProps}
        switchProps={f.switchProps}
        loadOptions={f.loadOptions}
        debounceTime={f.debounceTime}
        onAddNew={f.onAddNew}
        addNewLabel={f.addNewLabel}
        borderless={f.borderless}
        iconSearch={f.iconSearch}
        currencyLocale={f.currencyLocale}
        decimalPlaces={f.decimalPlaces}
        thousandSeparator={f.thousandSeparator}
        trimTrailingZeros={f.trimTrailingZeros}
        percentDecimalPlaces={f.percentDecimalPlaces}
        textAlign={f.textAlign}
        renderSkeleton={f.renderSkeleton}
        loaderMode={f.loaderMode}
        loaderSize={f.loaderSize}
        loaderRadius={f.loaderRadius}
      />
    );
  };

  const resolvedSections: FormSection<TValues, TRow>[] = useMemo(() => {
    if (currentStepConfig.sections?.length) return currentStepConfig.sections;
    if (currentStepConfig.fields?.length)
      return [
        {
          layout: currentStepConfig.layout ?? "stack",
          columns: currentStepConfig.columns,
          fields: currentStepConfig.fields,
        },
      ];
    return [];
  }, [currentStepConfig]);

  const renderButtons = () => {
    const showBack = currentStep > 0;
    const showCancel = !!onCancel;
    const primaryLabel = isLastStep
      ? mode === "CREATE"
        ? "Submit"
        : "Save Changes"
      : "Next";

    return (
      <div className="w-full flex flex-row items-center justify-between gap-3">
        <div className="flex flex-row gap-2 shrink-0">
          {showCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          {showBack && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={isSubmitting}
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
        </div>

        <div className="flex flex-row gap-2 shrink-0">
          {!isLastStep && (
            <Button
              type="button"
              variant="default"
              onClick={handleNext}
              disabled={isSubmitting}
            >
              {primaryLabel}
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
          )}
          {isLastStep && (
            <Button
              type="submit"
              variant="default"
              disabled={isSubmitting}
              onClick={form.handleSubmit(handleFinalSubmit)}
            >
              {isSubmitting ? "Processing..." : primaryLabel}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderStepSidebar = () => (
    <ol className="flex flex-col gap-6">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const isClickable = index <= maxVisitedStep + 1 || index <= currentStep;

        return (
          <li
            key={step.id ?? index}
            className={`flex items-start gap-3 select-none transition-colors ${
              isClickable ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
            }`}
            onClick={() => {
              if (isClickable) handleStepClick(index);
            }}
          >
            <div
              className={[
                "mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground border-primary ring-4 ring-primary/20"
                  : isCompleted
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted text-muted-foreground border-border",
              ].join(" ")}
            >
              {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
            </div>
            <div className="flex flex-col pt-0.5">
              <span
                className={`text-sm font-semibold ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.title}
              </span>
              {step.description && (
                <span className="text-xs text-muted-foreground">
                  {step.description}
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );

  const renderStepTopBar = () => {
    const manySteps = steps.length > 3;
    const containerClass = manySteps
      ? "grid gap-3 mb-6 grid-cols-[repeat(auto-fit,minmax(140px,1fr))]"
      : "flex flex-wrap items-center gap-6 mb-6";

    return (
      <ol className={containerClass}>
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isClickable =
            index <= maxVisitedStep + 1 || index <= currentStep;

          return (
            <li
              key={step.id ?? index}
              className={`flex items-center gap-2 select-none ${
                isClickable ? "cursor-pointer" : "opacity-50"
              }`}
              onClick={() => {
                if (isClickable) handleStepClick(index);
              }}
            >
              <div
                className={[
                  "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-medium",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : isCompleted
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted text-muted-foreground border-border",
                ].join(" ")}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`text-sm font-medium hidden sm:inline ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.title}
              </span>
            </li>
          );
        })}
      </ol>
    );
  };

  /* -----------------------------------------
   * JSX Render
   * ----------------------------------------- */

  // ✅ LOGIC: Determine layout classes dynamically based on props
  const wrapperClasses = cn(
    // Base style (Vertical / Mobile)
    "flex flex-col gap-8",

    // Horizontal mode (Always Grid)
    layoutMode === "horizontal" &&
      "grid grid-cols-[minmax(0,250px)_minmax(0,1fr)] gap-10",

    // Auto mode (Flex on mobile, Grid on desktop)
    layoutMode === "auto" &&
      "lg:grid lg:grid-cols-[minmax(0,250px)_minmax(0,1fr)] lg:gap-10"
  );

  // Determine if we should render the DOM element for sidebar
  // If vertical, we never want sidebar. If auto or horizontal, we render it but might hide it via CSS.
  const showSidebarDOM = layoutMode === "horizontal" || layoutMode === "auto";
  const sidebarClasses = cn(
    "flex flex-col gap-4 border-r border-border pr-6 py-2",
    // If auto, hide on mobile, show on desktop
    layoutMode === "auto" ? "hidden lg:flex" : "flex"
  );

  // Determine if we should render the DOM element for TopBar
  const showTopBarDOM = layoutMode === "vertical" || layoutMode === "auto";
  const topBarClasses = cn(
    "w-full",
    // If auto, show on mobile, hide on desktop
    layoutMode === "auto" ? "block lg:hidden" : "block"
  );

  return (
    <Form {...form}>
      <form onSubmit={formOnSubmit} className={className}>
        <FieldGroup className={cn("space-y-6", variantStyles[variant])}>
          {/* ✅ CONTAINER WITH CSS GRID CLASSES */}
          <div className={wrapperClasses}>
            {showSidebarDOM && (
              <aside className={sidebarClasses}>{renderStepSidebar()}</aside>
            )}

            <main className="flex flex-col gap-6 min-w-0">
              {showProgressBar && (
                <ProgressBar
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                />
              )}

              {showTopBarDOM && (
                <div className={topBarClasses}>{renderStepTopBar()}</div>
              )}

              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {resolvedSections.map((section, idx) => {
                  const effectiveLayout =
                    section.layout ??
                    currentStepConfig.layout ??
                    FormLayout ??
                    "stack";
                  const effectiveColumns =
                    section.columns ?? currentStepConfig.columns ?? FormColumns;

                  return (
                    <div key={idx} className="space-y-4">
                      {(section.title || section.description) && (
                        <div className="mb-4">
                          {section.title && (
                            <h3 className="text-lg font-semibold text-foreground">
                              {section.title}
                            </h3>
                          )}
                          {section.description && (
                            <p className="text-sm text-muted-foreground">
                              {section.description}
                            </p>
                          )}
                        </div>
                      )}
                      <div
                        className={getSectionLayoutClass(
                          effectiveLayout,
                          effectiveColumns
                        )}
                      >
                        {section.fields.map(renderField)}
                      </div>
                    </div>
                  );
                })}

                {recaptcha && isLastStep && (
                  <div className="flex flex-col gap-2 pt-2">
                    <ReCAPTCHAComponent
                      onVerify={(token) => {
                        setCaptchaToken(token);
                        setRecaptchaError(null);
                      }}
                    />
                    {recaptchaError && (
                      <p className="text-sm text-destructive">
                        {recaptchaError}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <FieldSeparator />

              {stickyFooter ? (
                <div className="sticky bottom-0 left-0 right-0 bg-background/95 backdrop-blur z-10 border-t border-border pt-4 pb-2 -mx-6 px-6 shadow-[0_-5px_10px_rgba(0,0,0,0.03)]">
                  {renderButtons()}
                </div>
              ) : (
                renderButtons()
              )}
            </main>
          </div>
        </FieldGroup>
      </form>
    </Form>
  );
}
