"use client";

import { cn } from "@/lib/utils";

import { dispatchThemeAction } from "./dispatchThemeAction";
import { useThemeBuilderState } from "./useThemeBuilderState";

const STEPS = Array.from({ length: 13 }, (_, i) =>
  parseFloat((i * 0.125).toFixed(3))
);

export function RadiusControl() {
  const { radius } = useThemeBuilderState();

  return (
    <div className="space-y-6">
      <div className="space-y-3 rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            Border Radius
          </label>
          <span className="rounded-lg border border-border/70 bg-background/80 px-2.5 py-1 font-mono text-xs text-foreground">
            {radius.toFixed(3)}rem
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1.5"
          step="0.125"
          value={radius}
          onChange={(event) =>
            dispatchThemeAction("setRadius", parseFloat(event.target.value))
          }
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
        />
        <div className="flex justify-between px-0.5">
          {STEPS.map((step) => (
            <span
              key={step}
              className={cn(
                "h-1 w-0.5 rounded-full transition-colors",
                Math.abs(step - radius) < 0.001 ? "bg-primary" : "bg-border"
              )}
            />
          ))}
        </div>
        <div className="flex justify-between px-0.5 text-[10px] text-muted-foreground">
          <span>0</span>
          <span>0.625</span>
          <span>1.5rem</span>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm">
        <label className="text-sm font-medium text-foreground">Preview</label>
        <div className="grid grid-cols-3 gap-3">
          <div
            className="flex h-20 items-center justify-center border border-border bg-card shadow-sm transition-all"
            style={{ borderRadius: `${radius}rem` }}
          >
            <span className="text-xs text-muted-foreground">Card</span>
          </div>

          <button
            type="button"
            className="h-20 bg-primary text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
            style={{ borderRadius: `${radius}rem` }}
          >
            Button
          </button>

          <input
            type="text"
            placeholder="Input"
            className="h-20 border border-input bg-background px-3 text-sm text-foreground transition-all placeholder:text-muted-foreground"
            style={{ borderRadius: `${radius}rem` }}
            readOnly
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Adjust the radius to change the roundness of all rounded elements.
      </p>
    </div>
  );
}
