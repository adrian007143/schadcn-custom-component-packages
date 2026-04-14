"use client";

import React from "react";
import { Controller, FieldPath, FieldValues, useWatch } from "react-hook-form";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";

import { FormFieldType } from "./constants";
import { FieldSkeleton } from "./FieldSkeleton";
import { FieldControlRenderer, HEIGHT_CLASSES } from "./render-field-control";
import { FieldRendererProps } from "./types";

function FieldRendererInner<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TRow extends Record<string, unknown> = Record<string, unknown>
>(props: FieldRendererProps<TFieldValues, TName, TRow>) {
  const {
    control,
    name,
    label,
    description,
    required,
    disabled,
    wrapperClassName,
    hideLabel,
    hideDescription,
    hideMessage,
    labelClassName,
    descriptionClassName,
    messageClassName,
    fieldType,
    height,
    renderSkeleton,
  } = props;
  const values = useWatch({ control }) as TFieldValues;

  const rendersInlineLabel =
    fieldType === FormFieldType.CHECKBOX || fieldType === FormFieldType.SWITCH;

  if (props.show && !props.show(values)) {
    return null;
  }

  if (fieldType === FormFieldType.SKELETON) {
    return renderSkeleton ? (
      renderSkeleton({} as never)
    ) : (
      <FieldSkeleton className={HEIGHT_CLASSES[height ?? "md"]} />
    );
  }

  return (
    <Controller
      control={control}
      name={name}
      disabled={disabled}
      render={({ field, fieldState }) => {
        const baseId = String(name).replace(/\./g, "-");
        const fieldId = `${baseId}-field`;
        const descriptionId = `${fieldId}-description`;
        const messageId = `${fieldId}-message`;
        const invalid = fieldState.invalid;

        return (
          <Field
            data-invalid={invalid}
            data-disabled={disabled || undefined}
            className={cn("w-full", wrapperClassName)}
            orientation={rendersInlineLabel ? "horizontal" : "vertical"}
          >
            {rendersInlineLabel ? (
              <>
                <FieldControlRenderer
                  field={field}
                  fieldId={fieldId}
                  descriptionId={descriptionId}
                  messageId={messageId}
                  invalid={invalid}
                  props={props}
                />
                <FieldContent>
                  {!hideLabel && label && (
                    <FieldLabel
                      htmlFor={fieldId}
                      className={cn(
                        "text-sm font-medium leading-none",
                        labelClassName
                      )}
                    >
                      {label}
                      {required && <span className="text-destructive">*</span>}
                    </FieldLabel>
                  )}

                  {!hideDescription && description && (
                    <FieldDescription
                      id={descriptionId}
                      className={cn(
                        "text-xs leading-relaxed text-muted-foreground",
                        descriptionClassName
                      )}
                    >
                      {description}
                    </FieldDescription>
                  )}

                  {!hideMessage && invalid && (
                    <FieldError
                      id={messageId}
                      errors={[fieldState.error]}
                      className={cn("text-xs font-medium", messageClassName)}
                    />
                  )}
                </FieldContent>
              </>
            ) : (
              <FieldContent>
                {!hideLabel && label && (
                  <FieldLabel
                    htmlFor={fieldId}
                    className={cn(
                      "text-sm font-medium leading-none",
                      labelClassName
                    )}
                  >
                    {label}
                    {required && <span className="text-destructive">*</span>}
                  </FieldLabel>
                )}

                <FieldControlRenderer
                  field={field}
                  fieldId={fieldId}
                  descriptionId={descriptionId}
                  messageId={messageId}
                  invalid={invalid}
                  props={props}
                />

                {!hideDescription && description && (
                  <FieldDescription
                    id={descriptionId}
                    className={cn(
                      "text-xs leading-relaxed text-muted-foreground",
                      descriptionClassName
                    )}
                  >
                    {description}
                  </FieldDescription>
                )}

                {!hideMessage && invalid && (
                  <FieldError
                    id={messageId}
                    errors={[fieldState.error]}
                    className={cn("text-xs font-medium", messageClassName)}
                  />
                )}
              </FieldContent>
            )}
          </Field>
        );
      }}
    />
  );
}

export const FieldRenderer = React.memo(
  FieldRendererInner
) as typeof FieldRendererInner;

/** @deprecated Use FieldRenderer instead. */
export const DynamicFormField = FieldRenderer;
