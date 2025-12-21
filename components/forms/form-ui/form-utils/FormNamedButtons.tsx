"use client";

import { Button } from "@/components/ui/button";
import { UseFormReturn, FieldValues } from "react-hook-form";
import { CRUDFormType, NamedFormButton } from "./NamedButtons";
import { cn } from "@/lib/utils";

export type ButtonLayout = "stack" | "inline" | "right" | "space-between";

function Spinner() {
  return (
    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
  );
}

interface Props<TValues extends FieldValues> {
  form: UseFormReturn<TValues>;
  buttons?: Record<string, NamedFormButton<TValues> | undefined>;
  formType?: CRUDFormType;
  isSubmitting: boolean;
  activeButton: string | null;
  setActiveButton: (key: string | null) => void;
  buttonLayout: ButtonLayout;
  className?: string;
}

export function FormNamedButtons<TValues extends FieldValues>({
  form,
  buttons = {},
  isSubmitting,
  activeButton,
  setActiveButton,
  buttonLayout,
  className,
}: Props<TValues>) {
  const values = form.getValues();

  const visibleEntries = Object.entries(buttons).filter(([, btn]) => {
    if (!btn) return false;
    if (typeof btn.hidden === "function") return !btn.hidden(values);
    return !btn.hidden;
  }) as [string, NamedFormButton<TValues>][];

  if (visibleEntries.length === 0) return null;

  // ROW LAYOUT
  if (buttonLayout !== "stack") {
    let layoutClass = "flex flex-row gap-2";
    if (buttonLayout === "right")
      layoutClass = "flex flex-row justify-end gap-2";
    else if (buttonLayout === "space-between")
      layoutClass = "flex flex-row justify-between gap-2";

    return (
      <div className={layoutClass}>
        {visibleEntries.map(([key, btn]) => {
          const isSubmit = btn.submit ?? false;
          const isLoading = isSubmitting && activeButton === key;

          return (
            <Button
              key={key}
              name={key}
              type={isSubmit ? "submit" : "button"}
              variant={btn.variant ?? "default"}
              size={btn.size ?? "default"}
              disabled={
                btn.disabled ||
                (isSubmitting && activeButton !== key && activeButton !== null)
              }
              onClick={() => {
                if (isSubmit) {
                  setActiveButton(key);
                } else {
                  btn.onClick?.(form);
                }
              }}
              className={cn(
                "flex items-center justify-center gap-2 cursor-pointer",
                btn.className,
                className
              )}
            >
              {isLoading && <Spinner />}
              {btn.iconLeft && !isLoading && <span>{btn.iconLeft}</span>}
              <span>
                {isLoading ? btn.loadingLabel ?? "Processing..." : btn.label}
              </span>
              {btn.iconRight && !isLoading && <span>{btn.iconRight}</span>}
            </Button>
          );
        })}
      </div>
    );
  }

  // STACK LAYOUT
  const grouped = visibleEntries.reduce<
    Record<string, [string, NamedFormButton<TValues>][]>
  >((acc, [key, btn]) => {
    const g = btn.group ?? "_default";
    if (!acc[g]) acc[g] = [];
    acc[g].push([key, btn]);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-4">
      {Object.keys(grouped).map((groupKey, groupIndex) => (
        <div
          key={groupKey}
          className={
            groupIndex > 0
              ? "flex flex-col gap-3 pt-3 border-t border-border"
              : "flex flex-col gap-3"
          }
        >
          {grouped[groupKey].map(([key, btn]) => {
            const isSubmit = btn.submit ?? false;
            const isLoading = isSubmitting && activeButton === key;

            return (
              <Button
                key={key}
                name={key}
                type={isSubmit ? "submit" : "button"}
                variant={btn.variant ?? "default"}
                size={btn.size ?? "default"}
                disabled={
                  btn.disabled ||
                  (isSubmitting &&
                    activeButton !== key &&
                    activeButton !== null)
                }
                onClick={() => {
                  if (isSubmit) {
                    setActiveButton(key);
                  } else {
                    btn.onClick?.(form);
                  }
                }}
                className={cn(
                  "w-full flex items-center justify-center gap-2 cursor-pointer",
                  btn.className,
                  className
                )}
              >
                {isLoading && <Spinner />}
                {btn.iconLeft && !isLoading && <span>{btn.iconLeft}</span>}
                <span>
                  {isLoading ? btn.loadingLabel ?? "Processing..." : btn.label}
                </span>
                {btn.iconRight && !isLoading && <span>{btn.iconRight}</span>}
              </Button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
