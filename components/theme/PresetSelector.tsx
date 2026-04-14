"use client";

import { Check } from "lucide-react";
import { useTheme } from "next-themes";

import { PRESET_IDS, THEME_PRESETS } from "@/lib/theme/presets";
import { oklchToHex } from "@/lib/theme/utils";
import { dispatchThemeAction } from "./dispatchThemeAction";
import { useThemeBuilderState } from "./useThemeBuilderState";

export function PresetSelector() {
  const { resolvedTheme } = useTheme();
  const { activePreset } = useThemeBuilderState();

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="text-sm font-medium">Preset Themes</p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Start from the default app theme or switch to one of the curated
          palettes.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => dispatchThemeAction("setThemePreset", "default")}
          className={[
            "group relative rounded-xl border p-3 text-left transition-all",
            activePreset === "default"
              ? "border-primary/60 bg-primary/5 shadow-sm ring-1 ring-primary/25"
              : "border-border/70 bg-card/60 hover:border-border hover:bg-card",
          ].join(" ")}
          title="Use the default app tokens from globals.css"
        >
          <div className="mb-3 grid h-14 grid-cols-3 gap-2 overflow-hidden rounded-lg border border-border/60 bg-background p-2">
            <span className="rounded-md bg-background shadow-sm" />
            <span className="rounded-md bg-muted" />
            <span className="rounded-md bg-primary/80" />
          </div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-foreground">Default</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Use app defaults
              </p>
            </div>
            {activePreset === "default" ? (
              <div className="rounded-full bg-primary p-1 text-primary-foreground">
                <Check className="h-3.5 w-3.5" />
              </div>
            ) : null}
          </div>
        </button>

        {PRESET_IDS.map((presetId) => {
          const preset = THEME_PRESETS[presetId];
          if (!preset) {
            return null;
          }
          const tokens = resolvedTheme === "dark" ? preset.dark : preset.light;
          const isActive = activePreset === presetId;

          return (
            <button
              key={presetId}
              type="button"
              onClick={() => dispatchThemeAction("setThemePreset", presetId)}
              className={[
                "group relative rounded-xl border p-3 text-left transition-all",
                isActive
                  ? "border-primary/60 bg-primary/5 shadow-sm ring-1 ring-primary/25"
                  : "border-border/70 bg-card/60 hover:border-border hover:bg-card",
              ].join(" ")}
              title={preset.description}
            >
              <div className="mb-3 grid h-14 grid-cols-4 gap-1.5 overflow-hidden rounded-lg border border-border/60 bg-background p-2 transition-transform group-hover:scale-[1.01]">
                <span
                  className="rounded"
                  style={{ backgroundColor: oklchToHex(tokens["--primary"] ?? preset.accentLight) }}
                />
                <span
                  className="rounded"
                  style={{ backgroundColor: oklchToHex(tokens["--background"] ?? "oklch(0.99 0 0)") }}
                />
                <span
                  className="rounded"
                  style={{ backgroundColor: oklchToHex(tokens["--muted"] ?? "oklch(0.93 0 0)") }}
                />
                <span
                  className="rounded"
                  style={{ backgroundColor: oklchToHex(tokens["--accent"] ?? preset.accentLight) }}
                />
              </div>

              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {preset.label}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                    {preset.description}
                  </p>
                </div>

                {isActive ? (
                  <div className="rounded-full bg-primary p-1 text-primary-foreground">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>

      <p className="px-1 text-xs text-muted-foreground">
        Selecting a preset clears custom color overrides.
      </p>
    </div>
  );
}
