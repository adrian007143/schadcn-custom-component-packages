"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

import { ALL_CSS_VARS, getEffectiveTokens } from "@/lib/theme/utils";
import { useThemeBuilderState } from "./useThemeBuilderState";

export function ThemeManager(): null {
  const { resolvedTheme } = useTheme();
  const themeState = useThemeBuilderState();

  useEffect(() => {
    let frameId = 0;
    const root = document.documentElement;
    const { activePreset, customLight, customDark, radius } = themeState;
    frameId = window.requestAnimationFrame(() => {
      if (activePreset === "default") {
        ALL_CSS_VARS.forEach((variable) => root.style.removeProperty(variable));
        root.style.setProperty("--radius", `${radius}rem`);
        return;
      }

      const merged = getEffectiveTokens(
        activePreset,
        customLight,
        customDark,
        resolvedTheme === "dark"
      );

      Object.entries(merged).forEach(([key, value]) => {
        if (value) {
          root.style.setProperty(key, value);
        }
      });

      root.style.setProperty("--radius", `${radius}rem`);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [resolvedTheme, themeState]);

  return null;
}
