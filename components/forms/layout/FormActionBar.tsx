"use client";

import type { ReactNode } from "react";

import { FieldSeparator } from "@/components/ui/field";

export function FormActionBar({ children }: { children: ReactNode }) {
  return (
    <div className="pt-4">
      <FieldSeparator className="mb-2" />
      {children}
    </div>
  );
}

/** @deprecated Use FormActionBar instead. */
export const FormActions = FormActionBar;
