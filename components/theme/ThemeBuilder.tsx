"use client";

import { useState } from "react";
import {
  LayoutGrid,
  Paintbrush,
  RotateCcw,
  Sliders,
  X,
} from "lucide-react";

import { useAppTheme } from "@/components/theme/app-theme-provider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { THEME_PRESETS } from "@/lib/theme/presets";
import { type ThemeBuilderTab } from "@/lib/theme/types";
import { cn } from "@/lib/utils";

import { ColorEditor } from "./ColorEditor";
import { dispatchThemeAction } from "./dispatchThemeAction";
import { PresetSelector } from "./PresetSelector";
import { PreviewPanel } from "./PreviewPanel";
import { RadiusControl } from "./RadiusControl";
import { useThemeBuilderState } from "./useThemeBuilderState";

export function ThemeBuilder() {
  const { isBuilderOpen, activePreset } = useThemeBuilderState();
  const { resolvedTheme } = useAppTheme();
  const [activeTab, setActiveTab] = useState<ThemeBuilderTab>("presets");

  const presetLabel =
    activePreset === "default"
      ? "Default"
      : (THEME_PRESETS[activePreset]?.label ?? "Default");

  const tabs = [
    { value: "presets", label: "Presets", icon: LayoutGrid },
    { value: "colors", label: "Colors", icon: Paintbrush },
    { value: "radius", label: "Radius", icon: Sliders },
  ] as const;

  return (
    <>
      <div
        aria-hidden
        onClick={() => dispatchThemeAction("setThemeBuilderOpen", false)}
        className={cn(
          "fixed inset-0 z-59 bg-background/45 backdrop-blur-[3px] transition-opacity duration-300 lg:hidden",
          isBuilderOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
      />

      <aside
        aria-label="Theme preset panel"
        aria-hidden={!isBuilderOpen}
        className={cn(
          "fixed inset-y-0 right-0 z-60 flex w-full flex-col sm:w-111.5 sm:max-w-111.5",
          "border-l border-border/80 bg-background/95 text-foreground shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl",
          "transition-transform duration-300 ease-out",
          isBuilderOpen ? "translate-x-0" : "translate-x-full",
          !isBuilderOpen && "pointer-events-none"
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.14),transparent_68%)]"
        />

        <header className="relative flex shrink-0 items-start justify-between border-b border-border/70 px-6 py-5">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Theme Preset
            </h2>
            <p className="text-xs text-muted-foreground">
              {presetLabel} - {resolvedTheme === "dark" ? "dark" : "light"} mode
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="size-9 rounded-full border border-border/70 bg-background/70 text-muted-foreground shadow-sm hover:bg-muted hover:text-foreground"
              onClick={() => dispatchThemeAction("resetTheme")}
              title="Reset to default theme"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-9 rounded-full border border-border/70 bg-background/70 text-muted-foreground shadow-sm hover:bg-muted hover:text-foreground"
              onClick={() => dispatchThemeAction("setThemeBuilderOpen", false)}
              title="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <div className="scrollbar-themed min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-6 px-6 py-6">
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as ThemeBuilderTab)}
              className="w-full gap-4"
            >
              <section className="space-y-4 rounded-[1.75rem] border border-border/70 bg-card/35 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                <TabsList className="grid h-auto min-h-14 w-full grid-cols-3 items-stretch gap-1.5 overflow-hidden rounded-[1.35rem] border border-border/70 bg-muted/40 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="relative h-11 min-h-11 w-full flex-none rounded-3xl border border-transparent px-3 py-2 text-sm font-medium text-muted-foreground transition-[background-color,border-color,color,box-shadow] duration-200 hover:text-foreground data-active:z-10 data-active:border-border/70 data-active:bg-background/95 data-active:text-foreground data-active:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_10px_24px_rgba(0,0,0,0.14)]"
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{tab.label}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                <TabsContent value="presets" className="mt-0 space-y-4 px-1 pb-1">
                  <PresetSelector />
                </TabsContent>

                <TabsContent value="colors" className="mt-0 space-y-4 px-1 pb-1">
                  <ColorEditor />
                </TabsContent>

                <TabsContent value="radius" className="mt-0 space-y-4 px-1 pb-1">
                  <RadiusControl />
                </TabsContent>
              </section>
            </Tabs>

            <section className="space-y-3 border-t border-border/70 pt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Live Preview
              </p>
              <PreviewPanel />
            </section>
          </div>
        </div>
      </aside>
    </>
  );
}
