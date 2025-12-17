"use client";

import { FieldSeparator } from "@/components/ui/field";

export function FormActions({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-4">
      <FieldSeparator className="mb-2" />
      {children}
    </div>
  );
}
