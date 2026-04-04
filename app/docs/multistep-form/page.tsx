import type { Metadata } from "next"
import Content from "./content.mdx"

export const metadata: Metadata = {
  title: "MultiStepForm — Per-Step Validation and Progress Tracking",
  description:
    "Build multi-step React forms with per-step Zod validation, progress indicators, reCAPTCHA support, and flexible auto/horizontal/vertical layouts. Each step validates independently.",
  alternates: { canonical: "https://formkitcn.pro/docs/multistep-form" },
  openGraph: {
    title: "MultiStepForm — FormKitCN Docs",
    description:
      "Per-step Zod validation, progress indicators, reCAPTCHA. Full multi-step form in one install.",
    url: "https://formkitcn.pro/docs/multistep-form",
  },
}

export default function MultistepFormPage() {
  return <Content />
}
