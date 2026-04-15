import type { Metadata } from "next"

import DynamicFormFieldShowcase from "@/components/examples/dynamic-form-field-showcase"
import { ExamplePageShell } from "@/components/site/ExamplePageShell"

export const metadata: Metadata = {
  title: "Dynamic Form Field",
  description:
    "Live preview of the FormKitCN field system with the current interactive control set, schema-driven composition, and shared validation wiring.",
  alternates: {
    canonical: "https://formkitcn.pro/blocks/dynamic-form-field",
  },
  openGraph: {
    title: "Dynamic Form Field - FormKitCN Block Preview",
    description:
      "A polished field gallery showing the current FormKitCN control surface in one schema-driven preview.",
    url: "https://formkitcn.pro/blocks/dynamic-form-field",
  },
}

export default function DynamicFormFieldBlockPage() {
  return (
    <ExamplePageShell
      title="Dynamic Form Field"
      description="A richer field gallery that previews the current FormKitCN input surface, overlay behavior, and schema-driven composition patterns."
      registryFile="form-field.json"
      codeFiles={["components/examples/dynamic-form-field-showcase.tsx"]}
    >
      <div className="flex justify-center">
        <DynamicFormFieldShowcase />
      </div>
    </ExamplePageShell>
  )
}
