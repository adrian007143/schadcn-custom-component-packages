import type { Metadata } from "next"
import CreateOrgForm from "@/components/examples/form-ui-multistep-template"
import { ExamplePageShell } from "@/components/site/ExamplePageShell"

export const metadata: Metadata = {
  title: "Multi-Step Form Example",
  description:
    "Live preview of FormKitCN's MultiStepForm component. Organization registration form with per-step Zod validation, progress tracking, and reCAPTCHA support.",
  alternates: { canonical: "https://formkitcn.pro/blocks/multistep" },
  openGraph: {
    title: "Multi-Step Form — FormKitCN Block Preview",
    description:
      "Per-step Zod validation, progress tracking, reCAPTCHA. One CLI install.",
    url: "https://formkitcn.pro/blocks/multistep",
  },
}

export default function MultiStepFormPage() {
  return (
    <ExamplePageShell
      title="Multi-Step Form"
      description="Organization registration form with per-step Zod validation, progress tracking, and reCAPTCHA support."
      registryFile="multistep-form-template.json"
      codeFiles={["components/examples/form-ui-multistep-template.tsx"]}
    >
      <CreateOrgForm />
    </ExamplePageShell>
  )
}
