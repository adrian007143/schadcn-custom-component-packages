"use client";

import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { cn } from "@/lib/utils";
import { DynamicRenderInput, HEIGHT_CLASSES } from "./render-dynamic-input";
import { CustomProps } from "./types";
import { FieldPath, FieldValues } from "react-hook-form";
import { FormFieldType } from "./constants";
import { FieldSkeletonLoader } from "./FieldSkeletonLoader";

function DynamicFormFieldInner<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>(props: CustomProps<TFieldValues, TName>) {
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

  /**
   * ⭐ SKELETON MODE
   * Use custom skeleton if provided, otherwise fallback to shimmer skeleton.
   * ✔ No styling altered
   * ✔ Height applied externally via HEIGHT_CLASSES
   */
  if (fieldType === FormFieldType.SKELETON) {
    return renderSkeleton
      ? renderSkeleton({} as any)
      : (
          <FieldSkeletonLoader
            className={HEIGHT_CLASSES[height ?? "md"]}
          />
        );
  }

  /**
   * ⭐ Normal field rendering
   * Nothing removed. All props preserved.
   */
  return (
    <FormField
      control={control}
      name={name}
      disabled={disabled} // ✔ KEEP DISABLED SUPPORT
      render={({ field }) => (
        <FormItem
          className={cn(
            "flex flex-col gap-2",
            wrapperClassName
          )}
        >
          {/* Label */}
          {!hideLabel && label && (
            <FormLabel className={cn(labelClassName)}>
              {label}
              {required && (
                <span className="text-destructive">*</span>
              )}
            </FormLabel>
          )}

          {/* Description */}
          {!hideDescription && description && (
            <p
              className={cn(
                "text-xs text-muted-foreground",
                descriptionClassName
              )}
            >
              {description}
            </p>
          )}

          {/* Input Renderer */}
          <DynamicRenderInput field={field} props={props} />

          {/* Validation Message */}
          {!hideMessage && (
            <FormMessage className={cn(messageClassName)} />
          )}
        </FormItem>
      )}
    />
  );
}

export const DynamicFormField = React.memo(
  DynamicFormFieldInner
) as typeof DynamicFormFieldInner;
