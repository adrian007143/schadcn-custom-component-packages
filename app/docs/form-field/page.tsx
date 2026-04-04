import type { Metadata } from "next"
import Content from "./content.mdx"

export const metadata: Metadata = {
  title: "DynamicFormField — 17+ Field Types",
  description:
    "DynamicFormField is a single React component that renders any of 17+ field types based on a fieldType prop. Integrates with react-hook-form. Supports input, password, textarea, select, async-select, date picker, phone, currency, file upload, and more.",
  alternates: { canonical: "https://formkitcn.pro/docs/form-field" },
  openGraph: {
    title: "DynamicFormField — FormKitCN Docs",
    description:
      "One component, 17+ field types. Integrates with react-hook-form and Zod validation.",
    url: "https://formkitcn.pro/docs/form-field",
  },
}

export default function FormFieldPage() {
  return <Content />
}
