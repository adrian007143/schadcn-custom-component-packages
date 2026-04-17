import type { Metadata } from "next"

import ThemeBuilderPreview from "@/components/examples/theme-builder-preview"
import { ExamplePageShell } from "@/components/site/ExamplePageShell"

export const metadata: Metadata = {
  title: "Theme Builder",
  description:
    "Interactive theme builder with 12 OKLCH presets, random palette generator, per-token color editor, radius control, and CSS/JSON export.",
  alternates: {
    canonical: "https://formkitcn.pro/blocks/theme-builder",
  },
  openGraph: {
    title: "Theme Builder - FormKitCN Block Preview",
    description:
      "12 OKLCH presets, seed-based palette generator, per-token color editor, and CSS export for instant theming.",
    url: "https://formkitcn.pro/blocks/theme-builder",
  },
}

export default function ThemeBuilderBlockPage() {
  return (
    <ExamplePageShell
      title="Theme Builder"
      description="12 OKLCH presets, seed-based palette generator, random palette, per-token color editor, radius control, and CSS/JSON export. Click the button below to open the panel."
      registryFile="theme-preset-tool.json"
      codeFiles={[
        "components/theme/ThemeManager.tsx",
        "lib/theme/theme-store.ts",
        "components/theme/useThemeBuilderState.standalone.ts",
        "components/theme/dispatchThemeAction.standalone.ts",
      ]}
    >
      <ThemeBuilderPreview />
    </ExamplePageShell>
  )
}
