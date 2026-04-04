import type { Metadata } from "next"
import Content from "./content.mdx"

export const metadata: Metadata = {
  title: "Introduction to FormKitCN",
  description:
    "FormKitCN is a schema-driven component toolkit for React built on shadcn/ui. Learn the layered architecture, included blocks (DynamicFormField, FormBuilderStandard, MultiStepForm, DynamicDataTable, Redux), and the registry installation model.",
  alternates: { canonical: "https://formkitcn.pro/docs/introduction" },
  openGraph: {
    title: "Introduction — FormKitCN Docs",
    description:
      "Schema-driven form components built on shadcn/ui. Own your code — no vendor lock-in.",
    url: "https://formkitcn.pro/docs/introduction",
  },
}

export default function IntroductionPage() {
  return <Content />
}
