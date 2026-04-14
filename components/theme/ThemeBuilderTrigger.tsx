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
      className="gap-2"
    >
      <Palette className="h-4 w-4" />
      <span className="hidden text-sm sm:inline">Theme</span>
    </Button>
  );
}
