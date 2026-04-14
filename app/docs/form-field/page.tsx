import type { Metadata } from "next";

import Content from "./content.mdx";

export const metadata: Metadata = {
  title: "Field Renderer - 17+ Field Types",
  description:
    "FieldRenderer is a single React component that renders 17+ field types from a schema config. It integrates with react-hook-form and supports text, password, textarea, select, async select, date, phone, currency, file upload, and more.",
  alternates: { canonical: "https://formkitcn.pro/docs/form-field" },
  openGraph: {
    title: "Field Renderer - FormKitCN Docs",
    description:
      "One component, 17+ field types. Integrates with react-hook-form and Zod validation.",
    url: "https://formkitcn.pro/docs/form-field",
  },
};

export default function FormFieldPage() {
  return <Content />;
}
