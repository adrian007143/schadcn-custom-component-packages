"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type ThemeMode = "light" | "dark";
type ThemePreference = ThemeMode | "system";

export type AppThemeProviderProps = {
  children: ReactNode;
  attribute?: string | string[];
  defaultTheme?: ThemePreference;
  enableSystem?: boolean;
  enableColorScheme?: boolean;
  disableTransitionOnChange?: boolean;
  storageKey?: string;
  forcedTheme?: ThemeMode;
  value?: Record<string, string>;
};

type AppThemeContextValue = {
  theme: ThemePreference;
  resolvedTheme: ThemeMode;
  systemTheme: ThemeMode;
  setTheme: (value: ThemePreference | ((current: ThemePreference) => ThemePreference)) => void;
};

const MEDIA = "(prefers-color-scheme: dark)";

const AppThemeContext = createContext<AppThemeContextValue | undefined>(undefined);

function getSystemTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia(MEDIA).matches ? "dark" : "light";
}

function disableTransitionsTemporarily() {
  const style = document.createElement("style");
  style.appendChild(
    document.createTextNode(
      "*,*::before,*::after{-webkit-transition:none!important;transition:none!important}"
    )
  );
  document.head.appendChild(style);

  return () => {
    window.getComputedStyle(document.body);
    window.setTimeout(() => {
      document.head.removeChild(style);
    }, 1);
  };
}

export function AppThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "dark",
  enableSystem = false,
  enableColorScheme = false,
  disableTransitionOnChange = true,
  storageKey = "app-theme",
  forcedTheme,
  value,
}: AppThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemePreference>(defaultTheme);
  const [systemTheme, setSystemTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let frameId = 0;

    try {
      const stored = window.localStorage.getItem(storageKey) as ThemePreference | null;
      if (stored === "light" || stored === "dark" || stored === "system") {
        frameId = window.requestAnimationFrame(() => {
          setThemeState(stored);
        });
      }
    } catch {
      // ignore storage failures
    }

    return () => window.cancelAnimationFrame(frameId);
  }, [storageKey]);

  useEffect(() => {
    if (!enableSystem || typeof window === "undefined") {
      return;
    }

    const media = window.matchMedia(MEDIA);
    const handleChange = () => setSystemTheme(getSystemTheme());

    handleChange();
    media.addEventListener("change", handleChange);

    return () => media.removeEventListener("change", handleChange);
  }, [enableSystem]);

  const resolvedTheme: ThemeMode = useMemo(() => {
    if (forcedTheme) {
      return forcedTheme;
    }

    if (theme === "system") {
      return enableSystem ? systemTheme : "light";
    }

    return theme;
  }, [enableSystem, forcedTheme, systemTheme, theme]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const root = document.documentElement;
    const cleanupTransitions = disableTransitionOnChange
      ? disableTransitionsTemporarily()
      : null;

    const applyToAttribute = (attr: string) => {
      const nextValue = value?.[resolvedTheme] ?? resolvedTheme;

      if (attr === "class") {
        root.classList.remove("light", "dark");
        root.classList.add(nextValue);
        return;
      }

      if (nextValue) {
        root.setAttribute(attr, nextValue);
      } else {
        root.removeAttribute(attr);
      }
    };

    if (Array.isArray(attribute)) {
      attribute.forEach(applyToAttribute);
    } else {
      applyToAttribute(attribute);
    }

    if (enableColorScheme) {
      root.style.colorScheme = resolvedTheme;
    }

    cleanupTransitions?.();
  }, [
    attribute,
    disableTransitionOnChange,
    enableColorScheme,
    resolvedTheme,
    value,
  ]);

  const setTheme = useCallback(
    (nextValue: ThemePreference | ((current: ThemePreference) => ThemePreference)) => {
      setThemeState((current) => {
        const resolvedPreference =
          typeof nextValue === "function" ? nextValue(current) : nextValue;

        try {
          window.localStorage.setItem(storageKey, resolvedPreference);
        } catch {
          // ignore storage failures
        }

        return resolvedPreference;
      });
    },
    [storageKey]
  );

  const contextValue = useMemo<AppThemeContextValue>(
    () => ({
      theme: forcedTheme ?? theme,
      resolvedTheme,
      systemTheme,
      setTheme,
    }),
    [forcedTheme, resolvedTheme, setTheme, systemTheme, theme]
  );

  return (
    <AppThemeContext.Provider value={contextValue}>
      {children}
    </AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(AppThemeContext);

  if (!context) {
    throw new Error("useAppTheme must be used within AppThemeProvider.");
  }

  return context;
}
