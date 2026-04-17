"use client";

import type { CSSProperties, ReactNode } from "react";

import { useThemeBuilderState } from "@/components/theme/useThemeBuilderState";
import { cn } from "@/lib/utils";

import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function AppShell({ children }: { children: ReactNode }) {
  const { isBuilderOpen } = useThemeBuilderState();
  const panelStyle = isBuilderOpen
    ? ({ "--app-shell-panel-offset": "446px" } as CSSProperties)
    : undefined;

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground transition-[background-color,color] duration-300">
      <SiteHeader />
      <main
        className={cn(
          "w-full min-w-0 flex-1 bg-background text-foreground transition-[padding-right,background-color,color] duration-300 ease-out",
          isBuilderOpen && "lg:pr-[var(--app-shell-panel-offset)]"
        )}
        style={panelStyle}
      >
        {children}
      </main>
      <div
        className={cn(
          "w-full bg-background text-foreground transition-[padding-right,background-color,color] duration-300 ease-out",
          isBuilderOpen && "lg:pr-[var(--app-shell-panel-offset)]"
        )}
        style={panelStyle}
      >
        <SiteFooter />
      </div>
    </div>
  );
}
