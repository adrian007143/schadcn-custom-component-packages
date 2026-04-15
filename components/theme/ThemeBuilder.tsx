"use client";

import { useState } from "react";
import {
  Download,
  LayoutGrid,
  Paintbrush,
  RotateCcw,
  Sliders,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { THEME_PRESETS } from "@/lib/theme/presets";
import { type ThemeBuilderTab } from "@/lib/theme/types";
import { cn } from "@/lib/utils";

import { ColorEditor } from "./ColorEditor";
import { dispatchThemeAction } from "./dispatchThemeAction";
import { ExportPanel } from "./ExportPanel";
import { PresetSelector } from "./PresetSelector";
import { PreviewPanel } from "./PreviewPanel";
import { RadiusControl } from "./RadiusControl";
import { useThemeBuilderState } from "./useThemeBuilderState";

export function ThemeBuilder() {
  const { isBuilderOpen, activePreset } = useThemeBuilderState();
  const { resolvedTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<ThemeBuilderTab>("presets");
  const isDark = resolvedTheme === "dark";

  const presetLabel =
    activePreset === "default"
      ? "Default"
      : (THEME_PRESETS[activePreset]?.label ?? "Default");

  const tabs = [
    { value: "presets", label: "Presets", icon: LayoutGrid },
    { value: "colors", label: "Colors", icon: Paintbrush },
    { value: "radius", label: "Radius", icon: Sliders },
    { value: "export", label: "Export", icon: Download },
  ] as const;

  return (
    <div
      aria-hidden={!isBuilderOpen}
      className={cn(
        "fixed inset-x-0 top-14 bottom-0 z-[60]",
        !isBuilderOpen && "pointer-events-none"
      )}
    >
      <button
        type="button"
        aria-label="Close theme builder overlay"
        onClick={() => dispatchThemeAction("setThemeBuilderOpen", false)}
        className={cn(
          "absolute inset-0 transition-opacity duration-300 lg:hidden",
          isDark
            ? "bg-slate-950/45 backdrop-blur-[2px]"
            : "bg-slate-900/10 backdrop-blur-[2px]",
          isBuilderOpen ? "pointer-events-auto opacity-100" : "opacity-0"
        )}
      />

      <aside
        className={cn(
          "absolute top-0 right-0 bottom-0 h-full w-full border-l transition-transform duration-300 ease-out sm:max-w-[446px] lg:w-[446px]",
          "pointer-events-auto isolate",
          isDark
            ? "border-slate-800/90 bg-[linear-gradient(180deg,#020617_0%,#050b1c_100%)] text-slate-50 shadow-[0_18px_60px_rgba(2,6,23,0.55)]"
            : "border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.98)_100%)] text-foreground shadow-[0_18px_48px_rgba(15,23,42,0.12)]",
          isBuilderOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div
          className={cn(
            "flex h-full min-h-0 flex-col",
            isDark ? "bg-slate-950/96" : "bg-white/85 backdrop-blur-xl"
          )}
        >
          <header
            className={cn(
              "flex items-center justify-between border-b px-5 py-4",
              isDark
                ? "border-slate-800/80 bg-slate-950/95"
                : "border-border/70 bg-white/92"
            )}
          >
            <div className="space-y-1">
              <div
                className={cn(
                  "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em]",
                  isDark
                    ? "border-slate-800 bg-slate-900/90 text-slate-400"
                    : "border-border bg-muted/60 text-muted-foreground"
                )}
              >
                Theme Lab
              </div>
              <h2
                className={cn(
                  "text-base font-semibold tracking-tight",
                  isDark ? "text-slate-50" : "text-foreground"
                )}
              >
                Theme Builder
              </h2>
              <p
                className={cn(
                  "text-[11px]",
                  isDark ? "text-slate-500" : "text-muted-foreground"
                )}
              >
                {presetLabel} · {resolvedTheme === "dark" ? "dark" : "light"} mode
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "size-8 rounded-full border transition-colors",
                  isDark
                    ? "border-slate-800 bg-slate-900/70 text-slate-200 hover:bg-slate-800 hover:text-slate-50"
                    : "border-border bg-background/80 text-foreground hover:bg-muted hover:text-foreground"
                )}
                onClick={() => dispatchThemeAction("resetTheme")}
                title="Reset to default theme"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "size-8 rounded-full border transition-colors",
                  isDark
                    ? "border-slate-800 bg-slate-900/70 text-slate-200 hover:bg-slate-800 hover:text-slate-50"
                    : "border-border bg-background/80 text-foreground hover:bg-muted hover:text-foreground"
                )}
                onClick={() => dispatchThemeAction("setThemeBuilderOpen", false)}
                title="Close theme builder"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="space-y-6 px-5 py-5">
              <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as ThemeBuilderTab)}
                className="w-full gap-5"
              >
                <TabsList
                  className={cn(
                    "grid h-14 w-full grid-cols-4 rounded-2xl border p-1.5",
                    isDark
                      ? "border-slate-800/80 bg-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
                      : "border-border/80 bg-muted/50"
                  )}
                >
                  {tabs.map((tab) => {
                    const Icon = tab.icon;

                    return (
                      <TabsTrigger
                        key={tab.value}
                        className={cn(
                          "flex flex-col items-center gap-0.5 rounded-xl border border-transparent text-[11px] font-semibold transition-all duration-200",
                          isDark
                            ? "text-slate-400 hover:text-slate-200 data-[selected]:border-slate-700 data-[selected]:bg-slate-800 data-[selected]:text-slate-50 data-[selected]:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                            : "text-muted-foreground hover:text-foreground data-[selected]:border-border data-[selected]:bg-background data-[selected]:text-foreground data-[selected]:shadow-sm"
                        )}
                        value={tab.value}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {tab.label}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                <TabsContent value="presets" className="mt-0 space-y-4">
                  <PresetSelector />
                </TabsContent>

                <TabsContent value="colors" className="mt-0 space-y-4">
                  <ColorEditor />
                </TabsContent>

                <TabsContent value="radius" className="mt-0 space-y-4">
                  <RadiusControl />
                </TabsContent>

                <TabsContent value="export" className="mt-0 space-y-4">
                  <ExportPanel />
                </TabsContent>
              </Tabs>

              <section
                className={cn(
                  "space-y-3 border-t pt-5",
                  isDark ? "border-slate-800/80" : "border-border/70"
                )}
              >
                <p
                  className={cn(
                    "text-sm font-semibold tracking-tight",
                    isDark ? "text-slate-50" : "text-foreground"
                  )}
                >
                  Live Preview
                </p>
                <PreviewPanel />
              </section>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
