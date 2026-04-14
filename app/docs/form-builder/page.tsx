import type { Metadata } from "next";

import Content from "./content.mdx";

export const metadata: Metadata = {
  title: "Schema Form - Schema-Driven Form Builder",
  description:
    "SchemaForm lets you define React forms as a config array of sections, fields, layout, and actions. It handles rendering, Zod validation, loading states, and submission automatically.",
  alternates: { canonical: "https://formkitcn.pro/docs/form-builder" },
  openGraph: {
    title: "Schema Form - FormKitCN Docs",
    description:
      "Define your form as a config array. Handles rendering, Zod validation, and submission automatically.",
    url: "https://formkitcn.pro/docs/form-builder",
  },
};

export default function FormBuilderPage() {
  return <Content />;
}
