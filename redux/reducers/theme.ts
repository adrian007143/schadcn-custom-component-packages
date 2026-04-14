import { createReduxMethods, ComposePayload } from "react-redux-methods";
import type { ThemeState, ThemePresetId, ThemeCssVar, ThemeCustomOverrides } from "@/lib/theme/types";

/**
 * Theme Redux Slice - manages all theme state
 * Includes: active preset, custom color overrides, radius, builder open state
 */

export const themeState: ThemeState = {
  activePreset: "default",
  customLight: {},
  customDark: {},
  radius: 0.625,
  isBuilderOpen: false,
};

const [themeReducer, themeActions, themeSelectors] = createReduxMethods({
  initialState: themeState,
  reducers: {
    /**
     * Switch to a different preset theme
     * Also clears all custom overrides for a clean slate
     */
    setThemePreset: (state, action: ComposePayload<ThemePresetId>) => ({
      ...state,
      activePreset: action.payload,
      customLight: {},
      customDark: {},
    }),

    /**
     * Override a single CSS variable in light mode
     */
    setCustomLight: (
      state,
      action: ComposePayload<{ key: ThemeCssVar; value: string }>
    ) => ({
      ...state,
      customLight: {
        ...state.customLight,
        [action.payload.key]: action.payload.value,
      },
    }),

    /**
     * Override a single CSS variable in dark mode
     */
    setCustomDark: (
      state,
      action: ComposePayload<{ key: ThemeCssVar; value: string }>
    ) => ({
      ...state,
      customDark: {
        ...state.customDark,
        [action.payload.key]: action.payload.value,
      },
    }),

    /**
     * Remove a single light-mode override and fall back to the active preset/default token
     */
    clearCustomLight: (state, action: ComposePayload<ThemeCssVar>) => {
      const nextCustomLight = { ...state.customLight };
      delete nextCustomLight[action.payload];

      return {
        ...state,
        customLight: nextCustomLight,
      };
    },

    /**
     * Remove a single dark-mode override and fall back to the active preset/default token
     */
    clearCustomDark: (state, action: ComposePayload<ThemeCssVar>) => {
      const nextCustomDark = { ...state.customDark };
      delete nextCustomDark[action.payload];

      return {
        ...state,
        customDark: nextCustomDark,
      };
    },

    /**
     * Batch import theme overrides from JSON
     * Replaces customLight, customDark, and radius entirely
     */
    importThemeOverrides: (
      state,
      action: ComposePayload<{
        preset: ThemePresetId;
        customLight: ThemeCustomOverrides;
        customDark: ThemeCustomOverrides;
        radius: number;
      }>
    ) => ({
      ...state,
      activePreset: action.payload.preset,
      customLight: action.payload.customLight,
      customDark: action.payload.customDark,
      radius: action.payload.radius,
    }),

    /**
     * Update the border radius value
     */
    setRadius: (state, action: ComposePayload<number>) => ({
      ...state,
      radius: action.payload,
    }),

    /**
     * Open or close the theme builder panel
     */
    setThemeBuilderOpen: (state, action: ComposePayload<boolean>) => ({
      ...state,
      isBuilderOpen: action.payload,
    }),

    /**
     * Reset all theme state to defaults
     */
    resetTheme: () => ({
      ...themeState,
      isBuilderOpen: false,
    }),
  },
  selectionNode: "theme",
  selectors: {
    getActivePreset: (s) => s.activePreset,
    getCustomLight: (s) => s.customLight,
    getCustomDark: (s) => s.customDark,
    getRadius: (s) => s.radius,
    getThemeBuilderOpen: (s) => s.isBuilderOpen,
  },
});

export { themeReducer, themeActions, themeSelectors };
