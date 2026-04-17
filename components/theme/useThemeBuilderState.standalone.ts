"use client";

import { useEffect, useSyncExternalStore } from "react";

import { DEFAULT_THEME_STATE, themeStore } from "@/lib/theme/theme-store";

/**
 * Standalone hook — no Redux required.
 * This file is installed by the theme-preset-tool registry package
 * as components/theme/useThemeBuilderState.ts in consumer projects.
 *
 * Hydration-safe: the store always starts with DEFAULT_THEME_STATE so the
 * server-rendered HTML matches the initial client render. Persisted state is
 * loaded from localStorage inside a useEffect (after hydration completes),
 * which prevents the "server/client text mismatch" hydration error.
 */
export function useThemeBuilderState() {
  // Load persisted state after React has hydrated the page.
  // This runs only once, client-side, after the initial render matches the server.
  useEffect(() => {
    themeStore.hydrate();
  }, []);

  return useSyncExternalStore(
    themeStore.subscribe,
    // Client snapshot — returns live state (may include persisted values post-hydrate)
    () => themeStore.getState().theme,
    // Server snapshot — always returns the default so SSR HTML is stable
    () => DEFAULT_THEME_STATE
  );
}
