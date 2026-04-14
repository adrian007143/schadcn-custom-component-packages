"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Moon, Shuffle, Sun, WandSparkles } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  buildPaletteOverridesFromSeed,
  getEffectiveTokens,
  oklchToHex,
} from "@/lib/theme/utils";

import type { ThemeCssVar, ThemeCustomOverrides } from "@/lib/theme/types";
import { cn } from "@/lib/utils";

import { ColorPickerRow } from "./ColorPickerRow";
import { dispatchThemeAction } from "./dispatchThemeAction";
import { useThemeBuilderState } from "./useThemeBuilderState";

// ─── Token Groups ────────────────────────────────────────────────────────────

const TOKEN_GROUPS: { label: string; vars: ThemeCssVar[] }[] = [
  {
    label: "Base",
    vars: ["--background", "--foreground"],
  },
  {
    label: "Card & Popover",
    vars: [
      "--card",
      "--card-foreground",
      "--popover",
      "--popover-foreground",
    ],
  },
  {
    label: "Brand",
    vars: [
      "--primary",
      "--primary-foreground",
      "--secondary",
      "--secondary-foreground",
      "--accent",
      "--accent-foreground",
      "--muted",
      "--muted-foreground",
    ],
  },
  {
    label: "Status & Inputs",
    vars: ["--destructive", "--border", "--input", "--ring"],
  },
  {
    label: "Charts",
    vars: ["--chart-1", "--chart-2", "--chart-3", "--chart-4", "--chart-5"],
  },
  {
    label: "Sidebar",
    vars: [
      "--sidebar",
      "--sidebar-foreground",
      "--sidebar-primary",
      "--sidebar-primary-foreground",
      "--sidebar-accent",
      "--sidebar-accent-foreground",
      "--sidebar-border",
      "--sidebar-ring",
    ],
  },
];

type TokenGroupsProps = {
  effectiveTokens: Partial<Record<ThemeCssVar, string>>;
  editMode: "light" | "dark";
  customLight: ThemeCustomOverrides;
  customDark: ThemeCustomOverrides;
};

function TokenGroups({ effectiveTokens, editMode, customLight, customDark }: TokenGroupsProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleGroup = (label: string) =>
    setCollapsed((prev) => ({ ...prev, [label]: !prev[label] }));

  return (
    <div className="space-y-2">
      {TOKEN_GROUPS.map((group) => {
        const isCollapsed = Boolean(collapsed[group.label]);
        const customCount = group.vars.filter((v) =>
          editMode === "light" ? Boolean(customLight[v]) : Boolean(customDark[v])
        ).length;

        return (
          <div
            key={group.label}
            className="rounded-2xl border border-slate-800/80 bg-slate-900/60 overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggleGroup(group.label)}
              className="flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-slate-800/40"
            >
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  {group.label}
                </span>
                <span className="rounded-full bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                  {group.vars.length}
                </span>
                {customCount > 0 && (
                  <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                    {customCount} edited
                  </span>
                )}
              </div>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 shrink-0 text-slate-500 transition-transform duration-200",
                  isCollapsed && "-rotate-90"
                )}
              />
            </button>

            {!isCollapsed && (
              <div className="px-3 pb-1">
                {group.vars.map((varName) => (
                  <ColorPickerRow
                    key={varName}
                    label={colorLabels[varName] || varName}
                    varName={varName}
                    mode={editMode}
                    resolvedValue={effectiveTokens[varName] || "#000000"}
                    isCustomized={
                      editMode === "light"
                        ? Boolean(customLight[varName])
                        : Boolean(customDark[varName])
                    }
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const colorLabels: Record<string, string> = {
  "--background": "Background",
  "--foreground": "Foreground",
  "--card": "Card",
  "--card-foreground": "Card Foreground",
  "--popover": "Popover",
  "--popover-foreground": "Popover Foreground",
  "--primary": "Primary",
  "--primary-foreground": "Primary Foreground",
  "--secondary": "Secondary",
  "--secondary-foreground": "Secondary Foreground",
  "--muted": "Muted",
  "--muted-foreground": "Muted Foreground",
  "--accent": "Accent",
  "--accent-foreground": "Accent Foreground",
  "--destructive": "Destructive",
  "--border": "Border",
  "--input": "Input",
  "--ring": "Ring",
  "--chart-1": "Chart 1",
  "--chart-2": "Chart 2",
  "--chart-3": "Chart 3",
  "--chart-4": "Chart 4",
  "--chart-5": "Chart 5",
  "--sidebar": "Sidebar",
  "--sidebar-foreground": "Sidebar Foreground",
  "--sidebar-primary": "Sidebar Primary",
  "--sidebar-primary-foreground": "Sidebar Primary Foreground",
  "--sidebar-accent": "Sidebar Accent",
  "--sidebar-accent-foreground": "Sidebar Accent Foreground",
  "--sidebar-border": "Sidebar Border",
  "--sidebar-ring": "Sidebar Ring",
};

function normalizeHex(value: string): string | null {
  const sanitized = value.trim().replace(/^#/, "");
  if (!/^[\da-fA-F]{6}$/.test(sanitized)) {
    return null;
  }

  return `#${sanitized.toUpperCase()}`;
}

function hslToHex(hue: number, saturation: number, lightness: number) {
  const normalizedHue = ((hue % 360) + 360) % 360;
  const s = saturation / 100;
  const l = lightness / 100;

  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const segment = normalizedHue / 60;
  const x = chroma * (1 - Math.abs((segment % 2) - 1));
  const match = l - chroma / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (segment >= 0 && segment < 1) {
    r = chroma;
    g = x;
  } else if (segment >= 1 && segment < 2) {
    r = x;
    g = chroma;
  } else if (segment >= 2 && segment < 3) {
    g = chroma;
    b = x;
  } else if (segment >= 3 && segment < 4) {
    g = x;
    b = chroma;
  } else if (segment >= 4 && segment < 5) {
    r = x;
    b = chroma;
  } else {
    r = chroma;
    b = x;
  }

  const toHex = (channel: number) =>
    Math.round((channel + match) * 255)
      .toString(16)
      .padStart(2, "0")
      .toUpperCase();

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function createRandomPaletteSeeds() {
  const hue = Math.floor(Math.random() * 360);
  const hueOffset = Math.floor(Math.random() * 20) - 10;
  const lightSeed = hslToHex(
    hue,
    50 + Math.floor(Math.random() * 26),
    36 + Math.floor(Math.random() * 14)
  );
  const darkSeed = hslToHex(
    hue + hueOffset,
    38 + Math.floor(Math.random() * 22),
    60 + Math.floor(Math.random() * 14)
  );

  return { lightSeed, darkSeed };
}

export function ColorEditor() {
  const { resolvedTheme } = useTheme();
  const themeState = useThemeBuilderState();
  const [editMode, setEditMode] = useState<"light" | "dark">(
    resolvedTheme === "dark" ? "dark" : "light"
  );

  const {
    activePreset,
    customLight,
    customDark,
    radius,
  } = themeState;

  const lightTokens = useMemo(
    () => getEffectiveTokens(activePreset, customLight, customDark, false),
    [activePreset, customLight, customDark]
  );
  const darkTokens = useMemo(
    () => getEffectiveTokens(activePreset, customLight, customDark, true),
    [activePreset, customLight, customDark]
  );

  const effectiveTokens = editMode === "light" ? lightTokens : darkTokens;

  const lightSeed = oklchToHex(lightTokens["--primary"] || "oklch(0.55 0.12 240)");
  const darkSeed = oklchToHex(darkTokens["--primary"] || "oklch(0.72 0.12 240)");
  const [lightDraft, setLightDraft] = useState<string | null>(null);
  const [darkDraft, setDarkDraft] = useState<string | null>(null);
  const lightDraftValue = lightDraft ?? lightSeed;
  const darkDraftValue = darkDraft ?? darkSeed;

  const commitLightDraft = () => {
    const normalized = normalizeHex(lightDraftValue);
    if (!normalized) {
      setLightDraft(null);
      return;
    }

    setLightDraft(normalized);
  };

  const commitDarkDraft = () => {
    const normalized = normalizeHex(darkDraftValue);
    if (!normalized) {
      setDarkDraft(null);
      return;
    }

    setDarkDraft(normalized);
  };

  const applyGeneratedPalette = () => {
    dispatchThemeAction("importThemeOverrides", {
      preset: activePreset,
      customLight: buildPaletteOverridesFromSeed(lightDraftValue, false),
      customDark: buildPaletteOverridesFromSeed(darkDraftValue, true),
      radius,
    });
  };

  const applyRandomPalette = () => {
    const { lightSeed: nextLightSeed, darkSeed: nextDarkSeed } =
      createRandomPaletteSeeds();

    setLightDraft(nextLightSeed);
    setDarkDraft(nextDarkSeed);

    dispatchThemeAction("importThemeOverrides", {
      preset: activePreset,
      customLight: buildPaletteOverridesFromSeed(nextLightSeed, false),
      customDark: buildPaletteOverridesFromSeed(nextDarkSeed, true),
      radius,
    });
  };

  return (
    <div className="space-y-5 text-slate-50">
      <div className="rounded-[1.75rem] border border-slate-800/80 bg-[linear-gradient(180deg,rgba(30,41,59,0.76),rgba(15,23,42,0.94))] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
        <div className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1.5">
              <p className="text-[1.25rem] font-semibold tracking-tight text-slate-50">
                Palette Builder
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Seeded Generator
              </p>
            </div>
            <div className="w-fit rounded-full border border-slate-700/80 bg-slate-800/80 px-3 py-1.5 text-[11px] font-medium text-slate-300">
              Light + Dark Pair
            </div>
          </div>
          <p className="max-w-[48ch] text-sm leading-7 text-slate-400">
            Pick your desired light and dark brand colors, then generate a full
            palette override automatically.
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Light Brand Color
            </span>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-700/70 bg-slate-950/35 p-3">
              <input
                type="color"
                value={lightDraftValue}
                onChange={(event) => {
                  const next = event.target.value.toUpperCase();
                  setLightDraft(next);
                }}
                className="h-11 w-11 cursor-pointer rounded-xl border border-slate-600 bg-transparent p-1"
                title="Choose the light-mode brand color"
              />
              <Input
                value={lightDraftValue}
                onChange={(event) => setLightDraft(event.target.value.toUpperCase())}
                onBlur={commitLightDraft}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    commitLightDraft();
                  }
                }}
                className="h-11 rounded-xl border-slate-700 bg-slate-900/80 font-mono text-sm font-semibold uppercase tracking-[0.08em] text-slate-50"
                aria-label="Light brand color"
              />
            </div>
          </label>

          <label className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Dark Brand Color
            </span>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-700/70 bg-slate-950/35 p-3">
              <input
                type="color"
                value={darkDraftValue}
                onChange={(event) => {
                  const next = event.target.value.toUpperCase();
                  setDarkDraft(next);
                }}
                className="h-11 w-11 cursor-pointer rounded-xl border border-slate-600 bg-transparent p-1"
                title="Choose the dark-mode brand color"
              />
              <Input
                value={darkDraftValue}
                onChange={(event) => setDarkDraft(event.target.value.toUpperCase())}
                onBlur={commitDarkDraft}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    commitDarkDraft();
                  }
                }}
                className="h-11 rounded-xl border-slate-700 bg-slate-900/80 font-mono text-sm font-semibold uppercase tracking-[0.08em] text-slate-50"
                aria-label="Dark brand color"
              />
            </div>
          </label>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          <Button
            type="button"
            className="group h-12 w-full justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-primary/85 px-5 text-sm font-semibold text-primary-foreground shadow-[0_10px_24px_rgba(59,130,246,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(59,130,246,0.24)] active:translate-y-0 active:scale-[0.985]"
            onClick={applyGeneratedPalette}
          >
            <WandSparkles className="h-4 w-4 transition-transform duration-200 group-hover:rotate-6 group-active:scale-95" />
            Apply Generated Palette
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="group h-12 w-full justify-center gap-2 rounded-2xl border border-slate-700/90 bg-slate-800/90 px-5 text-sm font-semibold text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-600 hover:bg-slate-700/90 hover:shadow-[0_12px_28px_rgba(15,23,42,0.32)] active:translate-y-0 active:scale-[0.985]"
            onClick={applyRandomPalette}
          >
            <Shuffle className="h-4 w-4 transition-transform duration-200 group-hover:rotate-12 group-active:-rotate-6" />
            Random Palette
          </Button>
        </div>
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-slate-800/70 bg-slate-950/35 px-3.5 py-3">
          <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary/80" />
          <p className="text-xs leading-6 text-slate-400">
            This updates surfaces, accents, charts, and sidebar tokens for both
            modes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setEditMode("light")}
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all duration-200",
            editMode === "light"
              ? "border-amber-500/40 bg-amber-500/10 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.08)]"
              : "border-slate-700/60 bg-slate-900/50 text-slate-500 hover:border-slate-600 hover:text-slate-300"
          )}
        >
          <Sun className={cn("h-3.5 w-3.5", editMode === "light" ? "text-amber-400" : "text-slate-600")} />
          Light
        </button>
        <button
          type="button"
          onClick={() => setEditMode("dark")}
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all duration-200",
            editMode === "dark"
              ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.08)]"
              : "border-slate-700/60 bg-slate-900/50 text-slate-500 hover:border-slate-600 hover:text-slate-300"
          )}
        >
          <Moon className={cn("h-3.5 w-3.5", editMode === "dark" ? "text-indigo-400" : "text-slate-600")} />
          Dark
        </button>
      </div>

      <TokenGroups
        effectiveTokens={effectiveTokens}
        editMode={editMode}
        customLight={customLight}
        customDark={customDark}
      />

      <p className="px-1 text-xs leading-relaxed text-slate-400">
        Fine-tune any token with the swatch or hex input. Reset buttons restore
        individual values back to the active preset.
      </p>
    </div>
  );
}
