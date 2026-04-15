"use client";

import { ReactNode } from "react";

import { useThemeBuilderState } from "@/components/theme/useThemeBuilderState";
import { cn } from "@/lib/utils";

import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function AppShell({ children }: { children: ReactNode }) {
  const { isBuilderOpen } = useThemeBuilderState();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main
        className={cn(
          "flex-1 transition-[padding-right] duration-300 ease-out",
          isBuilderOpen && "lg:pr-[446px]"
        )}
      >
        {children}
      </main>
      <div
        className={cn(
          "transition-[padding-right] duration-300 ease-out",
          isBuilderOpen && "lg:pr-[446px]"
        )}
      >
        <SiteFooter />
      </div>
    </div>
  );
}
