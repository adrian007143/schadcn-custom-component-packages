import type { Metadata } from "next"
import Content from "./content.mdx"

export const metadata: Metadata = {
  title: "Form Layout Primitives — FormSection, FormColumns, FormRow",
  description:
    "Composable layout primitives for structuring React forms without FormBuilderStandard. Use FormSection, FormColumns, FormRow, FormActions, and FormFieldWrapper for full layout control.",
  alternates: { canonical: "https://formkitcn.pro/docs/form-layout" },
  openGraph: {
    title: "Form Layout Primitives — FormKitCN Docs",
    description:
      "Composable primitives for structured form layouts: FormSection, FormColumns, FormRow, FormActions.",
    url: "https://formkitcn.pro/docs/form-layout",
  },
}

export default function FormLayoutPage() {
  return <Content />
}
