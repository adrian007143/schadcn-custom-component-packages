"use client";

import type { CSSProperties, ReactNode } from "react";

import { useThemeBuilderState } from "@/components/theme/useThemeBuilderState";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  panelOffset?: string;
};

export function AppShell({
  children,
  header,
  footer,
  panelOffset = "446px",
}: AppShellProps) {
  const { isBuilderOpen } = useThemeBuilderState();
  const panelStyle = isBuilderOpen
    ? ({ "--app-shell-panel-offset": panelOffset } as CSSProperties)
    : undefined;

  return (
    <div className="flex min-h-dvh w-full flex-1 flex-col bg-background text-foreground transition-[background-color,color] duration-300">
      {header}
      <main
        className={cn(
          "flex min-h-0 w-full min-w-0 flex-1 flex-col bg-background text-foreground transition-[padding-right,background-color,color] duration-300 ease-out",
          isBuilderOpen && "lg:pr-(--app-shell-panel-offset)"
        )}
        style={panelStyle}
      >
        {children}
      </main>
      {footer ? (
        <div
          className={cn(
            "w-full bg-background text-foreground transition-[padding-right,background-color,color] duration-300 ease-out",
            isBuilderOpen && "lg:pr-(--app-shell-panel-offset)"
          )}
          style={panelStyle}
        >
          {footer}
        </div>
      ) : null}
    </div>
  );
}
