import type { Metadata } from "next"

import LoginFormTemplate from "@/components/examples/login-form-template"
import { ExamplePageShell } from "@/components/site/ExamplePageShell"

export const metadata: Metadata = {
  title: "Login Form Template",
  description:
    "Live preview of a reusable login template built with SchemaForm, shared field controls, and Zod validation.",
  alternates: {
    canonical: "https://formkitcn.pro/blocks/login-form-template",
  },
  openGraph: {
    title: "Login Form Template - FormKitCN Block Preview",
    description:
      "A production-ready login form starter built with SchemaForm and the shared FormKitCN field system.",
    url: "https://formkitcn.pro/blocks/login-form-template",
  },
}

export default function LoginFormTemplateBlockPage() {
  return (
    <ExamplePageShell
      title="Login Form Template"
      description="A starter login form built with SchemaForm on top of the shared FormKitCN field system."
      registryFile="form-dynamic-template.json"
      codeFiles={["components/examples/login-form-template.tsx"]}
    >
      <div className="flex justify-center">
        <LoginFormTemplate />
      </div>
    </ExamplePageShell>
  )
}
