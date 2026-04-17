/**
 * Theme Utilities
 * Color conversion, CSS export, and theme management helpers
 */

/**
 * Normalize a hex color string to uppercase #RRGGBB format.
 * Returns null if the input is not a valid 6-digit hex color.
 */
export function normalizeHex(value: string): string | null {
  const sanitized = value.trim().replace(/^#/, "");
  if (!/^[\da-fA-F]{6}$/.test(sanitized)) return null;
  return `#${sanitized.toUpperCase()}`;
}

import type {
  OklchComponents,
  ThemePresetId,
  ThemeCustomOverrides,
  ThemeCssVar,
  ThemeTokenMap,
  ThemeExportJSON,
} from "./types";
import { THEME_PRESETS } from "./presets";

/**
 * All CSS custom property names the theme system manages
 */
export const ALL_CSS_VARS: ThemeCssVar[] = [
  "--background",
  "--foreground",
  "--card",
  "--card-foreground",
  "--popover",
  "--popover-foreground",
  "--primary",
  "--primary-foreground",
  "--secondary",
  "--secondary-foreground",
  "--muted",
  "--muted-foreground",
  "--accent",
  "--accent-foreground",
  "--destructive",
  "--border",
  "--input",
  "--ring",
  "--chart-1",
  "--chart-2",
  "--chart-3",
  "--chart-4",
  "--chart-5",
  "--sidebar",
  "--sidebar-foreground",
  "--sidebar-primary",
  "--sidebar-primary-foreground",
  "--sidebar-accent",
  "--sidebar-accent-foreground",
  "--sidebar-border",
  "--sidebar-ring",
];

/**
 * Convert hex color (#RRGGBB) to OKLCH
 * Pure math, no external dependencies
 * Path: hex → linear sRGB → OKLab → OKLCH
 */
export function hexToOklch(hex: string): OklchComponents {
  // Parse hex
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  // Linearize sRGB (gamma correction)
  const toLinear = (c: number): number =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);

  // Linear sRGB → OKLab (Ottosson 2020 matrix)
  const l_ = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m_ = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s_ = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);

  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const bLab = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

  // OKLab → OKLCH
  const C = Math.sqrt(a * a + bLab * bLab);
  const H = ((Math.atan2(bLab, a) * 180) / Math.PI + 360) % 360;

  return { l: L, c: C, h: H };
}

/**
 * Convert OKLCH color string (e.g., "oklch(0.5 0.1 180)") to hex
 * Path: OKLCH → OKLab → linear sRGB → hex
 */
export function oklchToHex(oklchStr: string): string {
  // Parse "oklch(L C H)" or "oklch(L C H / A%)"
  const match = oklchStr.match(
    /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+)%?)?\s*\)/
  );
  if (!match) return "#000000";

  const L = parseFloat(match[1]);
  const C = parseFloat(match[2]);
  const H = parseFloat(match[3]);

  // OKLCH → OKLab
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  // OKLab → linear sRGB (Ottosson 2020 inverse)
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const lc = l_ * l_ * l_;
  const mc = m_ * m_ * m_;
  const sc = s_ * s_ * s_;

  const r = +4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc;
  const g = -1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc;
  const bv = -0.0041960863 * lc - 0.7034186147 * mc + 1.7076147010 * sc;

  // Gamma correction
  const toGamma = (c: number): number => {
    c = Math.max(0, Math.min(1, c));
    return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  };

  const toHex = (c: number): string =>
    Math.round(toGamma(c) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(bv)}`.toUpperCase();
}

/**
 * Format OKLCH components as a CSS oklch() string
 */
export function oklchToString(c: OklchComponents): string {
  const lStr = c.l.toFixed(3);
  const cStr = c.c.toFixed(3);
  const hStr = c.h.toFixed(3);

  if (c.alpha !== undefined && c.alpha < 1) {
    return `oklch(${lStr} ${cStr} ${hStr} / ${(c.alpha * 100).toFixed(0)}%)`;
  }

  return `oklch(${lStr} ${cStr} ${hStr})`;
}

/**
 * Extract alpha value from an oklch() string, if present
 * Returns undefined if no alpha, or the alpha value (0–1)
 */
export function extractAlpha(oklchStr: string): number | undefined {
  const match = oklchStr.match(/oklch\([^/]+\/\s*([\d.]+)%?\s*\)/);
  if (!match) return undefined;

  const alphaPercent = parseFloat(match[1]);
  return alphaPercent / 100;
}

/**
 * Remove alpha from an oklch() string if present
 */
export function stripAlpha(oklchStr: string): string {
  return oklchStr.replace(/\s*\/\s*[\d.]+%?\s*\)/, ")");
}

/**
 * Re-apply alpha to an oklch() string
 */
export function reapplyAlpha(oklchStr: string, alpha: number | undefined): string {
  if (!alpha || alpha >= 1) return oklchStr;

  const stripped = stripAlpha(oklchStr);
  const alphaPercent = Math.round(alpha * 100);
  return stripped.slice(0, -1) + ` / ${alphaPercent}%)`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeHue(hue: number): number {
  return ((hue % 360) + 360) % 360;
}

function toToken(
  lightness: number,
  chroma: number,
  hue: number,
  alpha?: number
): string {
  return oklchToString({
    l: clamp(lightness, 0, 1),
    c: clamp(chroma, 0, 0.37),
    h: normalizeHue(hue),
    alpha,
  });
}

function toNeutralForeground(hue: number, isDark: boolean): string {
  return toToken(isDark ? 0.96 : 0.16, isDark ? 0.008 : 0.03, hue);
}

function toPrimaryForeground(hue: number, isDark: boolean): string {
  return toToken(isDark ? 0.15 : 0.99, isDark ? 0.018 : 0.004, hue);
}

export function buildPaletteOverridesFromSeed(
  seedHex: string,
  isDark: boolean
): ThemeCustomOverrides {
  const seed = hexToOklch(seedHex);
  const hue = normalizeHue(seed.h);
  const softChroma = clamp(seed.c * 0.18, 0.01, 0.03);
  const midChroma = clamp(seed.c * 0.45, 0.03, 0.09);
  const strongChroma = clamp(seed.c * 0.9, 0.08, 0.18);

  if (isDark) {
    return {
      "--background": toToken(0.145, softChroma, hue),
      "--foreground": toNeutralForeground(hue, true),
      "--card": toToken(0.195, clamp(seed.c * 0.24, 0.014, 0.032), hue),
      "--card-foreground": toNeutralForeground(hue, true),
      "--popover": toToken(0.195, clamp(seed.c * 0.24, 0.014, 0.032), hue),
      "--popover-foreground": toNeutralForeground(hue, true),
      "--primary": toToken(clamp(Math.max(seed.l, 0.72), 0.72, 0.82), strongChroma, hue),
      "--primary-foreground": toPrimaryForeground(hue, true),
      "--secondary": toToken(0.25, clamp(seed.c * 0.28, 0.015, 0.04), hue),
      "--secondary-foreground": toNeutralForeground(hue, true),
      "--muted": toToken(0.25, clamp(seed.c * 0.28, 0.015, 0.04), hue),
      "--muted-foreground": toToken(0.64, clamp(seed.c * 0.16, 0.018, 0.05), hue),
      "--accent": toToken(0.25, clamp(seed.c * 0.28, 0.015, 0.04), hue),
      "--accent-foreground": toNeutralForeground(hue, true),
      "--border": "oklch(1 0 0 / 8%)",
      "--input": "oklch(1 0 0 / 12%)",
      "--ring": toToken(0.56, clamp(seed.c * 0.4, 0.04, 0.08), hue),
      "--chart-1": toToken(0.72, strongChroma, hue),
      "--chart-2": toToken(0.66, clamp(seed.c * 0.82, 0.07, 0.16), hue + 28),
      "--chart-3": toToken(0.74, clamp(seed.c * 0.76, 0.07, 0.15), hue - 28),
      "--chart-4": toToken(0.68, clamp(seed.c * 0.66, 0.06, 0.13), hue + 82),
      "--chart-5": toToken(0.66, clamp(seed.c * 0.66, 0.06, 0.13), hue - 82),
      "--sidebar": toToken(0.195, clamp(seed.c * 0.22, 0.014, 0.03), hue),
      "--sidebar-foreground": toNeutralForeground(hue, true),
      "--sidebar-primary": toToken(0.72, strongChroma, hue),
      "--sidebar-primary-foreground": toPrimaryForeground(hue, true),
      "--sidebar-accent": toToken(0.25, clamp(seed.c * 0.28, 0.015, 0.04), hue),
      "--sidebar-accent-foreground": toNeutralForeground(hue, true),
      "--sidebar-border": "oklch(1 0 0 / 8%)",
      "--sidebar-ring": toToken(0.56, clamp(seed.c * 0.4, 0.04, 0.08), hue),
    };
  }

  return {
    "--background": toToken(0.985, softChroma, hue),
    "--foreground": toNeutralForeground(hue, false),
    "--card": "oklch(1 0 0)",
    "--card-foreground": toNeutralForeground(hue, false),
    "--popover": "oklch(1 0 0)",
    "--popover-foreground": toNeutralForeground(hue, false),
    "--primary": toToken(clamp(seed.l, 0.42, 0.62), strongChroma, hue),
    "--primary-foreground": toPrimaryForeground(hue, false),
    "--secondary": toToken(0.935, clamp(seed.c * 0.22, 0.012, 0.028), hue),
    "--secondary-foreground": toToken(0.25, midChroma, hue),
    "--muted": toToken(0.935, clamp(seed.c * 0.22, 0.012, 0.028), hue),
    "--muted-foreground": toToken(0.54, clamp(seed.c * 0.16, 0.018, 0.05), hue),
    "--accent": toToken(0.935, clamp(seed.c * 0.22, 0.012, 0.028), hue),
    "--accent-foreground": toToken(0.25, midChroma, hue),
    "--border": toToken(0.88, clamp(seed.c * 0.16, 0.01, 0.02), hue),
    "--input": toToken(0.88, clamp(seed.c * 0.16, 0.01, 0.02), hue),
    "--ring": toToken(0.62, clamp(seed.c * 0.34, 0.04, 0.08), hue),
    "--chart-1": toToken(0.58, strongChroma, hue),
    "--chart-2": toToken(0.62, clamp(seed.c * 0.82, 0.07, 0.16), hue + 28),
    "--chart-3": toToken(0.68, clamp(seed.c * 0.76, 0.07, 0.15), hue - 28),
    "--chart-4": toToken(0.72, clamp(seed.c * 0.66, 0.06, 0.13), hue + 82),
    "--chart-5": toToken(0.64, clamp(seed.c * 0.66, 0.06, 0.13), hue - 82),
    "--sidebar": toToken(0.965, clamp(seed.c * 0.12, 0.008, 0.018), hue),
    "--sidebar-foreground": toNeutralForeground(hue, false),
    "--sidebar-primary": toToken(clamp(seed.l, 0.42, 0.62), strongChroma, hue),
    "--sidebar-primary-foreground": toPrimaryForeground(hue, false),
    "--sidebar-accent": toToken(0.915, clamp(seed.c * 0.18, 0.01, 0.024), hue),
    "--sidebar-accent-foreground": toToken(0.25, midChroma, hue),
    "--sidebar-border": toToken(0.86, clamp(seed.c * 0.14, 0.01, 0.02), hue),
    "--sidebar-ring": toToken(0.62, clamp(seed.c * 0.34, 0.04, 0.08), hue),
  };
}

/**
 * Get the effective CSS variable values for a given theme + mode
 * Merges preset tokens with user overrides
 */
export function getEffectiveTokens(
  activePreset: ThemePresetId,
  customLight: ThemeCustomOverrides,
  customDark: ThemeCustomOverrides,
  isDark: boolean
): Partial<ThemeTokenMap> {
  if (activePreset === "default") {
    // For default, return only user overrides (CSS defaults take care of the rest)
    return isDark ? customDark : customLight;
  }

  const preset = THEME_PRESETS[activePreset];
  if (!preset) return isDark ? customDark : customLight;

  const baseTokens = isDark ? preset.dark : preset.light;
  const overrides = isDark ? customDark : customLight;

  return { ...baseTokens, ...overrides };
}

/**
 * Build a CSS block as string (:root / .dark)
 * Suitable for copy-paste into globals.css
 */
export function buildCssExport(
  activePreset: ThemePresetId,
  customLight: ThemeCustomOverrides,
  customDark: ThemeCustomOverrides,
  radius: number
): string {
  const lightTokens = getEffectiveTokens(activePreset, customLight, customDark, false);
  const darkTokens = getEffectiveTokens(activePreset, customLight, customDark, true);

  const renderBlock = (tokens: Partial<ThemeTokenMap>, indent = "  "): string => {
    const lines = Object.entries(tokens)
      .map(([k, v]) => `${indent}${k}: ${v};`)
      .sort();
    return lines.join("\n");
  };

  return [
    `:root {`,
    `  --radius: ${radius}rem;`,
    renderBlock(lightTokens),
    `}`,
    ``,
    `.dark {`,
    renderBlock(darkTokens),
    `}`,
  ].join("\n");
}

/**
 * Export theme state as JSON for sharing/importing
 */
export function exportThemeAsJson(
  activePreset: ThemePresetId,
  customLight: ThemeCustomOverrides,
  customDark: ThemeCustomOverrides,
  radius: number
): ThemeExportJSON {
  return {
    version: 1,
    activePreset,
    customLight,
    customDark,
    radius,
  };
}

/**
 * Parse JSON import and validate
 * Returns the parsed data or null if invalid
 */
export function parseThemeJson(raw: string): ThemeExportJSON | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    if (!("version" in parsed)) return null;

    const data = parsed as Record<string, unknown>;
    if (data.version !== 1) return null;

    return {
      version: 1,
      activePreset: (data.activePreset as ThemePresetId) || "default",
      customLight: (data.customLight as ThemeCustomOverrides) || {},
      customDark: (data.customDark as ThemeCustomOverrides) || {},
      radius: (data.radius as number) || 0.625,
    };
  } catch {
    return null;
  }
}
