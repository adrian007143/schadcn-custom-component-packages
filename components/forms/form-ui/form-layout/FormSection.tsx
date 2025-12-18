"use client";

import { cn } from "@/lib/utils";

interface FormSectionProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export function FormSection({
  title,
  description,
  children,
  className
}: FormSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {/* Reduced spacing for cleaner alignment */}
      <div className={cn("space-y-3", className)}>{children}</div>
    </div>
  );
}
