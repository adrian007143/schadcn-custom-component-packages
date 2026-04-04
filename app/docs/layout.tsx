import type { Metadata } from "next"
import { DocsShell } from "@/components/docs/DocsShell"

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "FormKitCN component documentation. Guides and API reference for DynamicFormField, FormBuilderStandard, MultiStepForm, DynamicDataTable, and Redux setup.",
  alternates: {
    canonical: "https://formkitcn.pro/docs/introduction",
  },
}

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DocsShell>{children}</DocsShell>
}
