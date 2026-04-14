"use client";

import { useState } from "react";
import { Download, LayoutGrid, Paintbrush, RotateCcw, Sliders, X } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { THEME_PRESETS } from "@/lib/theme/presets";
import { type ThemeBuilderTab } from "@/lib/theme/types";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  const presetLabel =
    activePreset === "default"
      ? "Default"
      : (THEME_PRESETS[activePreset]?.label ?? "Default");

  return (
    <aside
      aria-hidden={!isBuilderOpen}
      className={cn(
        "fixed top-14 right-0 bottom-0 z-40 h-[calc(100vh-3.5rem)] w-full border-l border-t border-slate-800/90 bg-[linear-gradient(180deg,#020617_0%,#050b1c_100%)] text-slate-50 shadow-[0_18px_60px_rgba(2,6,23,0.55)] transition-transform duration-300 ease-out sm:max-w-[446px]",
        isBuilderOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex h-full min-h-0 flex-col">
        <header className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/85 px-5 py-3.5 backdrop-blur-xl">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-slate-50">
              Theme Builder
            </h2>
            <p className="text-[11px] text-slate-500">
              {presetLabel} · {resolvedTheme === "dark" ? "dark" : "light"} mode
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-full border border-slate-800 bg-slate-900/70 text-slate-200 transition-colors hover:bg-slate-800 hover:text-slate-50"
              onClick={() => dispatchThemeAction("resetTheme")}
              title="Reset to default theme"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-full border border-slate-800 bg-slate-900/70 text-slate-200 transition-colors hover:bg-slate-800 hover:text-slate-50"
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
              <TabsList className="grid h-14 w-full grid-cols-4 rounded-2xl border border-slate-800/80 bg-slate-900/85 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
                <TabsTrigger
                  className="flex flex-col items-center gap-0.5 rounded-xl border border-transparent text-[11px] font-semibold text-slate-400 transition-all duration-200 hover:text-slate-200 data-[selected]:border-slate-700 data-[selected]:bg-slate-800 data-[selected]:text-slate-50 data-[selected]:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                  value="presets"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  Presets
                </TabsTrigger>
                <TabsTrigger
                  className="flex flex-col items-center gap-0.5 rounded-xl border border-transparent text-[11px] font-semibold text-slate-400 transition-all duration-200 hover:text-slate-200 data-[selected]:border-slate-700 data-[selected]:bg-slate-800 data-[selected]:text-slate-50 data-[selected]:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                  value="colors"
                >
                  <Paintbrush className="h-3.5 w-3.5" />
                  Colors
                </TabsTrigger>
                <TabsTrigger
                  className="flex flex-col items-center gap-0.5 rounded-xl border border-transparent text-[11px] font-semibold text-slate-400 transition-all duration-200 hover:text-slate-200 data-[selected]:border-slate-700 data-[selected]:bg-slate-800 data-[selected]:text-slate-50 data-[selected]:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                  value="radius"
                >
                  <Sliders className="h-3.5 w-3.5" />
                  Radius
                </TabsTrigger>
                <TabsTrigger
                  className="flex flex-col items-center gap-0.5 rounded-xl border border-transparent text-[11px] font-semibold text-slate-400 transition-all duration-200 hover:text-slate-200 data-[selected]:border-slate-700 data-[selected]:bg-slate-800 data-[selected]:text-slate-50 data-[selected]:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                  value="export"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export
                </TabsTrigger>
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

            <section className="space-y-3 border-t border-slate-800/80 pt-5">
              <p className="text-sm font-semibold tracking-tight">Live Preview</p>
              <PreviewPanel />
            </section>
          </div>
        </div>
      </div>
    </aside>
  );
}
