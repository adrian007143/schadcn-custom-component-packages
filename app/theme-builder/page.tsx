"use client";

import { useEffect } from "react";

import { dispatchThemeAction } from "@/components/theme/dispatchThemeAction";

export default function ThemeBuilderPage() {
  useEffect(() => {
    dispatchThemeAction("setThemeBuilderOpen", true);
  }, []);

  return (
    <div className="container max-w-4xl py-16">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold">Theme Builder</h1>
        <p className="text-lg text-muted-foreground">
          Customize your FormKitCN theme with live preview
        </p>
        <p className="mx-auto max-w-2xl text-sm text-muted-foreground">
          Use the theme builder panel on the right to explore color presets,
          customize individual colors, adjust border radius, and export your
          theme as CSS or JSON.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-muted/30 p-6">
          <h3 className="mb-2 font-semibold">11 Curated Presets + Default</h3>
          <p className="text-sm text-muted-foreground">
            Choose from Midnight, Forest, Ocean, Sunset, Nordic, Rosewood,
            Lavender, Graphite, Aurora, Copper, and Jade, or keep the default
            app theme.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-muted/30 p-6">
          <h3 className="mb-2 font-semibold">Per-Variable Customization</h3>
          <p className="text-sm text-muted-foreground">
            Fine-tune every color with native color pickers.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-muted/30 p-6">
          <h3 className="mb-2 font-semibold">Radius Control</h3>
          <p className="text-sm text-muted-foreground">
            Adjust border radius from sharp to fully rounded.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-muted/30 p-6">
          <h3 className="mb-2 font-semibold">Export &amp; Share</h3>
          <p className="text-sm text-muted-foreground">
            Export as CSS or JSON, then import themes from others.
          </p>
        </div>
      </div>

      <div className="mt-12 rounded-lg border border-border bg-primary/5 p-6">
        <h3 className="mb-3 font-semibold">Getting Started</h3>
        <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
          <li>Click the &quot;Presets&quot; tab to see 11 pre-built themes.</li>
          <li>Click &quot;Colors&quot; to customize individual CSS variables.</li>
          <li>Click &quot;Radius&quot; to adjust border roundness.</li>
          <li>Click &quot;Export&quot; to get your theme as CSS or JSON.</li>
          <li>Toggle between light and dark modes to customize both.</li>
        </ol>
      </div>
    </div>
  );
}
