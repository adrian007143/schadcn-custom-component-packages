"use client";

export function FormDivider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 my-4">
      <div className="h-px flex-1 bg-border" />
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}
