/**
 * Theme System TypeScript Types
 * Canonical source for theme type definitions
 */

/**
 * All CSS custom property names managed by the theme system
 */
export type ThemeCssVar =
  | "--background"
  | "--foreground"
  | "--card"
  | "--card-foreground"
  | "--popover"
  | "--popover-foreground"
  | "--primary"
  | "--primary-foreground"
  | "--secondary"
  | "--secondary-foreground"
  | "--muted"
  | "--muted-foreground"
  | "--accent"
  | "--accent-foreground"
  | "--destructive"
  | "--border"
  | "--input"
  | "--ring"
  | "--chart-1"
  | "--chart-2"
  | "--chart-3"
  | "--chart-4"
  | "--chart-5"
  | "--sidebar"
  | "--sidebar-foreground"
  | "--sidebar-primary"
  | "--sidebar-primary-foreground"
  | "--sidebar-accent"
  | "--sidebar-accent-foreground"
  | "--sidebar-border"
  | "--sidebar-ring";

/**
 * A complete mapping of all CSS variables for a single mode (light or dark)
 * Values are oklch() strings
 */
export type ThemeTokenMap = Record<ThemeCssVar, string>;

/**
 * User customizations on top of a preset theme
 */
export type ThemeCustomOverrides = Partial<ThemeTokenMap>;

/**
 * One complete theme preset with both light and dark variants
 */
export type ThemePreset = {
  id: ThemePresetId;
  label: string;
  description: string;
  /** Accent color swatch for the preset card - light mode */
  accentLight: string;
  /** Accent color swatch for the preset card - dark mode */
  accentDark: string;
  light: ThemeTokenMap;
  dark: ThemeTokenMap;
};

/**
 * The unique identifiers for all available theme presets
 */
export type ThemePresetId =
  | "default"
  | "midnight"
  | "forest"
  | "ocean"
  | "sunset"
  | "nordic"
  | "rosewood"
  | "lavender"
  | "graphite"
  | "aurora"
  | "copper"
  | "jade";

/**
 * Redux state shape for theme slice
 */
export type ThemeState = {
  /** Active theme preset identifier */
  activePreset: ThemePresetId;
  /** User color overrides for light mode (merged on top of preset) */
  customLight: ThemeCustomOverrides;
  /** User color overrides for dark mode (merged on top of preset) */
  customDark: ThemeCustomOverrides;
  /** Border radius in rem (e.g., 0.625) */
  radius: number;
  /** Whether the theme builder sheet is open */
  isBuilderOpen: boolean;
};

/**
 * Components of an OKLCH color for conversion utilities
 */
export type OklchComponents = {
  /** Lightness (0–1) */
  l: number;
  /** Chroma (0–0.4 typical) */
  c: number;
  /** Hue (0–360) */
  h: number;
  /** Alpha (0–1), optional */
  alpha?: number;
};

/**
 * Exported theme as JSON (for sharing/importing)
 */
export type ThemeExportJSON = {
  version: 1;
  activePreset: ThemePresetId;
  customLight: ThemeCustomOverrides;
  customDark: ThemeCustomOverrides;
  radius: number;
};

/**
 * Theme builder UI state (local component state, not Redux)
 */
export type ThemeBuilderTab = "presets" | "colors" | "radius" | "export";
export type ExportFormat = "css" | "json";
