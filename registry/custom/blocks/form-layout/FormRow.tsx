"use client";

import { FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";

interface FormRowProps {
  children: React.ReactNode;
  className?: string;
}

export function FormRow({ children, className }: FormRowProps) {
  return (
    <FieldGroup
      className={cn("flex flex-row gap-4 items-start w-full", className)}
    >
      {children}
    </FieldGroup>
  );
}
