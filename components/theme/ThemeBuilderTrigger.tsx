"use client";

import { Palette } from "lucide-react";

import { Button } from "@/components/ui/button";

import { dispatchThemeAction } from "./dispatchThemeAction";

export function ThemeBuilderTrigger() {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => dispatchThemeAction("setThemeBuilderOpen", true)}
      title="Open theme builder"
      className="gap-2 rounded-full border border-border/70 bg-background/70 px-3 text-muted-foreground shadow-sm hover:bg-muted hover:text-foreground"
    >
      <Palette className="h-4 w-4" />
      <span className="hidden text-sm sm:inline">Theme</span>
    </Button>
  );
}
