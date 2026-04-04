import type { Metadata } from "next"
import FormLayoutComponent from "@/components/examples/form-layout-template"
import { ExamplePageShell } from "@/components/site/ExamplePageShell"

export const metadata: Metadata = {
  title: "Form Layout Primitives Example",
  description:
    "Live preview of FormKitCN form layout components: FormSection, FormColumns, FormRow, FormActions, and FormFieldWrapper. Composable primitives for structured, responsive form layouts.",
  alternates: { canonical: "https://formkitcn.pro/blocks/form-layout" },
  openGraph: {
    title: "Form Layout Primitives — FormKitCN Block Preview",
    description:
      "Composable layout primitives for structured forms: sections, columns, rows, and action bars.",
    url: "https://formkitcn.pro/blocks/form-layout",
  },
}

export default function FormLayoutPage() {
  return (
    <ExamplePageShell
      title="Form Layout"
      description="Composable form layout primitives — FormSection, FormColumns, FormRow, FormActions, and FormFieldWrapper."
      registryFile="form-layout.json"
      codeFiles={["components/examples/form-layout-template.tsx"]}
    >
      <FormLayoutComponent />
    </ExamplePageShell>
  )
}
