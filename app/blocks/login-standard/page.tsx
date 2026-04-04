import type { Metadata } from "next"
import LoginFormPage from "@/components/examples/form-ui-dynamic-template"
import { ExamplePageShell } from "@/components/site/ExamplePageShell"

export const metadata: Metadata = {
  title: "Dynamic Login Form Example",
  description:
    "Live preview of FormBuilderStandard with schema-driven fields, Zod validation, and toast notifications. See how to build a complete login form using DynamicFormField components.",
  alternates: { canonical: "https://formkitcn.pro/blocks/login-standard" },
  openGraph: {
    title: "Dynamic Login Form — FormKitCN Block Preview",
    description:
      "Schema-driven login form with Zod validation. Built with FormBuilderStandard and DynamicFormField.",
    url: "https://formkitcn.pro/blocks/login-standard",
  },
}

export default function LoginPage() {
  return (
    <ExamplePageShell
      title="Dynamic Form — Login"
      description="A login form built with FormBuilderStandard using schema-driven fields, Zod validation, and toast notifications."
      registryFile="form-dynamic-template.json"
      codeFiles={["components/examples/form-ui-dynamic-template.tsx"]}
    >
      <div className="flex justify-center">
        <LoginFormPage />
      </div>
    </ExamplePageShell>
  )
}
