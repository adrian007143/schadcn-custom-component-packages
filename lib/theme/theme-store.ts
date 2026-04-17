/**
 * Standalone Theme Store
 * Lightweight observable store for the theme builder.
 * No Redux, no Zustand — uses native useSyncExternalStore + localStorage.
 * Installed as part of the theme-preset-tool registry package.
 */

import type { ThemeState } from "./types";

const STORAGE_KEY = "formkitcn-theme-state";
type PersistedThemeState = ThemeState;

export const DEFAULT_THEME_STATE: ThemeState = {
  activePreset: "default",
  customLight: {},
  customDark: {},
  radius: 0.625,
  isBuilderOpen: false,
};

type Listener = () => void;

function loadFromStorage(): Partial<PersistedThemeState> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

class ThemeStoreImpl {
  /**
   * Always start with DEFAULT_THEME_STATE — never read localStorage here.
   * This ensures server and client render the same initial HTML (no hydration mismatch).
   * Call hydrate() inside a useEffect to load the persisted state after mount.
   */
  private _state: ThemeState = DEFAULT_THEME_STATE;
  private _hydrated = false;
  private _listeners = new Set<Listener>();
  private _timer: ReturnType<typeof setTimeout> | null = null;

  /**
   * Subscribe to state changes.
   * Returns an unsubscribe function — compatible with useSyncExternalStore.
   */
  subscribe = (listener: Listener): (() => void) => {
    this._listeners.add(listener);
    return () => {
      this._listeners.delete(listener);
    };
  };

  /**
   * Get the current store state.
   * Returns { theme } to mirror the Redux store shape used by the app.
   */
  getState = (): { theme: ThemeState } => ({
    theme: this._state,
  });

  /**
   * Load persisted state from localStorage after React has mounted.
   * Safe to call multiple times — only runs once.
   * Call this inside a useEffect so it never runs during SSR or hydration.
   */
  hydrate = (): void => {
    if (this._hydrated || typeof window === "undefined") return;
    this._hydrated = true;

    const persisted = loadFromStorage();
    if (!persisted) return;

    this._state = {
      ...DEFAULT_THEME_STATE,
      ...persisted,
    };
    this._listeners.forEach((l) => l());
  };

  /**
   * Dispatch a state update.
   * Accepts a pure reducer function — no action objects needed.
   */
  dispatch = (updater: (prev: ThemeState) => ThemeState): void => {
    this._state = updater(this._state);
    this._listeners.forEach((l) => l());
    // Debounced persist (120ms)
    if (this._timer) clearTimeout(this._timer);
    this._timer = setTimeout(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(this._state satisfies PersistedThemeState)
        );
      } catch {
        // Silently ignore storage errors (e.g. private browsing quota)
      }
    }, 120);
  };
}

export const themeStore = new ThemeStoreImpl();
