"use client";

/**
 * AppProviders — standalone, no Redux required.
 * Consumer projects that also use Redux should wrap this with their own StoreProvider.
 *
 * Wraps: AppThemeProvider + ThemeManager + ThemeBuilder + Toaster.
 */

import type { ReactNode } from "react";

import {
  AppThemeProvider,
  type AppThemeProviderProps,
} from "@/components/theme/app-theme-provider";
import { ThemeBuilder } from "@/components/theme/ThemeBuilder";
import { ThemeManager } from "@/components/theme/ThemeManager";
import { Toaster } from "@/components/ui/sonner";

export type AppProvidersProps = {
  children: ReactNode;
  /** Mount the sonner Toaster. Defaults to true. */
  withToaster?: boolean;
  toasterPosition?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
} & Omit<AppThemeProviderProps, "children">;

export function AppProviders({
  children,
  withToaster = true,
  toasterPosition = "top-center",
  attribute = "class",
  defaultTheme = "dark",
  enableSystem = false,
  // Disable color-scheme injection to prevent hydration mismatch on <html>
  enableColorScheme = false,
  disableTransitionOnChange = true,
  storageKey = "app-theme",
  ...themeProviderProps
}: AppProvidersProps) {
  return (
    <AppThemeProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      enableColorScheme={enableColorScheme}
      disableTransitionOnChange={disableTransitionOnChange}
      storageKey={storageKey}
      {...themeProviderProps}
    >
      <ThemeManager />
      <ThemeBuilder />
      {children}
      {withToaster ? <Toaster position={toasterPosition} /> : null}
    </AppThemeProvider>
  );
}
