import LoginFormPage from "@/components/examples/form-ui-dynamic-template"
import { ExamplePageShell } from "@/components/site/ExamplePageShell"

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
