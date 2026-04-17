"use client"

import { Palette, Shuffle, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { dispatchThemeAction } from "@/components/theme/dispatchThemeAction"

const PRESET_HIGHLIGHTS = [
  { name: "Midnight", hue: "265°", style: "bg-[oklch(0.42_0.18_265)]" },
  { name: "Forest", hue: "148°", style: "bg-[oklch(0.38_0.12_148)]" },
  { name: "Ocean", hue: "205°", style: "bg-[oklch(0.42_0.14_205)]" },
  { name: "Sunset", hue: "44°", style: "bg-[oklch(0.58_0.18_44)]" },
  { name: "Rosewood", hue: "18°", style: "bg-[oklch(0.56_0.18_18)]" },
  { name: "Aurora", hue: "168°", style: "bg-[oklch(0.56_0.16_168)]" },
]

export default function ThemeBuilderPreview() {
  return (
    <div className="flex flex-col items-center gap-8 py-10 px-4 w-full max-w-lg mx-auto">
      {/* Preset swatch row */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {PRESET_HIGHLIGHTS.map((p) => (
          <div key={p.name} className="flex flex-col items-center gap-1.5">
            <div className={`h-8 w-8 rounded-full border border-border/60 shadow-sm ${p.style}`} />
            <span className="text-[10px] text-muted-foreground font-medium">{p.name}</span>
          </div>
        ))}
      </div>

      {/* Feature badges */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Badge variant="secondary" className="gap-1.5 text-xs">
          <Palette className="h-3 w-3" /> 12 OKLCH Presets
        </Badge>
        <Badge variant="secondary" className="gap-1.5 text-xs">
          <Shuffle className="h-3 w-3" /> Random Palette
        </Badge>
        <Badge variant="secondary" className="gap-1.5 text-xs">
          <Download className="h-3 w-3" /> CSS / JSON Export
        </Badge>
      </div>

      {/* CTA */}
      <Button
        size="lg"
        className="gap-2 px-8"
        onClick={() => dispatchThemeAction("setThemeBuilderOpen", true)}
      >
        <Palette className="h-4 w-4" />
        Open Theme Builder
      </Button>

      <p className="text-xs text-muted-foreground text-center max-w-xs">
        The panel slides in from the right. Switch presets, generate a random palette, fine-tune individual tokens, then copy the CSS into your project.
      </p>
    </div>
  )
}
