import type { Metadata } from "next"
import Content from "./content.mdx"

export const metadata: Metadata = {
  title: "FormBuilderStandard — Schema-Driven Form Builder",
  description:
    "FormBuilderStandard lets you define React forms as a config array — sections, fields, layout, buttons. Handles rendering, Zod validation, loading states, and submission automatically.",
  alternates: { canonical: "https://formkitcn.pro/docs/form-builder" },
  openGraph: {
    title: "FormBuilderStandard — FormKitCN Docs",
    description:
      "Define your form as a config array. Handles rendering, Zod validation, and submission automatically.",
    url: "https://formkitcn.pro/docs/form-builder",
  },
}

export default function FormBuilderPage() {
  return <Content />
}
