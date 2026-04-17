"use client";

import { themeStore } from "@/lib/theme/theme-store";
import type {
  ThemeCssVar,
  ThemeCustomOverrides,
  ThemePresetId,
} from "@/lib/theme/types";

/**
 * Action argument types — mirrors the Redux slice actions exactly.
 */
type Actions = {
  setThemePreset: [preset: ThemePresetId];
  setCustomLight: [payload: { key: ThemeCssVar; value: string }];
  setCustomDark: [payload: { key: ThemeCssVar; value: string }];
  clearCustomLight: [variable: ThemeCssVar];
  clearCustomDark: [variable: ThemeCssVar];
  importThemeOverrides: [
    payload: {
      preset: ThemePresetId;
      customLight: ThemeCustomOverrides;
      customDark: ThemeCustomOverrides;
      radius: number;
    },
  ];
  setRadius: [value: number];
  setThemeBuilderOpen: [open: boolean];
  resetTheme: [];
};

/**
 * Standalone dispatcher — no Redux required.
 * Same call signature as the Redux-coupled version — drop-in replacement.
 * This file is installed by the theme-preset-tool registry package
 * as components/theme/dispatchThemeAction.ts in consumer projects.
 */
export function dispatchThemeAction<K extends keyof Actions>(
  key: K,
  ...args: Actions[K]
): void {
  themeStore.dispatch((prev) => {
    switch (key) {
      case "setThemePreset":
        return {
          ...prev,
          activePreset: args[0] as ThemePresetId,
          customLight: {},
          customDark: {},
        };

      case "setCustomLight": {
        const p = args[0] as Actions["setCustomLight"][0];
        return {
          ...prev,
          customLight: { ...prev.customLight, [p.key]: p.value },
        };
      }

      case "setCustomDark": {
        const p = args[0] as Actions["setCustomDark"][0];
        return {
          ...prev,
          customDark: { ...prev.customDark, [p.key]: p.value },
        };
      }

      case "clearCustomLight": {
        const variable = args[0] as ThemeCssVar;
        const nextCustomLight = { ...prev.customLight };
        delete nextCustomLight[variable];
        return { ...prev, customLight: nextCustomLight };
      }

      case "clearCustomDark": {
        const variable = args[0] as ThemeCssVar;
        const nextCustomDark = { ...prev.customDark };
        delete nextCustomDark[variable];
        return { ...prev, customDark: nextCustomDark };
      }

      case "importThemeOverrides": {
        const p = args[0] as Actions["importThemeOverrides"][0];
        return {
          ...prev,
          activePreset: p.preset,
          customLight: p.customLight,
          customDark: p.customDark,
          radius: p.radius,
        };
      }

      case "setRadius":
        return { ...prev, radius: args[0] as number };

      case "setThemeBuilderOpen":
        return { ...prev, isBuilderOpen: args[0] as boolean };

      case "resetTheme":
        return {
          activePreset: "default" as const,
          customLight: {},
          customDark: {},
          radius: 0.625,
          isBuilderOpen: prev.isBuilderOpen,
        };

      default:
        return prev;
    }
  });
}
