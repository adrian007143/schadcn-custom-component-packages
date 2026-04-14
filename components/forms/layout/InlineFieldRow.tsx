"use client";

import { FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";

interface FormRowProps {
  children: React.ReactNode;
  className?: string;
}

export function InlineFieldRow({ children, className }: FormRowProps) {
  return (
    <FieldGroup
      className={cn("flex flex-row gap-4 items-start w-full", className)}
    >
      {children}
    </FieldGroup>
  );
}

/** @deprecated Use InlineFieldRow instead. */
export const FormRow = InlineFieldRow;
