import type { Metadata } from "next"

import Content from "./content.mdx"

export const metadata: Metadata = {
  title: "Theme Builder - Built-In Presets, Panel, and Minimal Setup",
  description:
    "Use the built-in FormKitCN theme system with minimal layout setup. Theme presets, panel integration, color editing, radius controls, and AppHeader controls are already included.",
  alternates: { canonical: "https://formkitcn.pro/docs/theme-builder" },
  openGraph: {
    title: "Theme Builder - FormKitCN Docs",
    description:
      "Built-in theme presets, native sidebar panel, AppHeader integration, and minimal layout setup for FormKitCN.",
    url: "https://formkitcn.pro/docs/theme-builder",
  },
}

export default function ThemeBuilderPage() {
  return <Content />
}
