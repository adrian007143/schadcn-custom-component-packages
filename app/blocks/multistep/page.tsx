import CreateOrgForm from "@/components/examples/form-ui-multistep-template"
import { ExamplePageShell } from "@/components/site/ExamplePageShell"

export default function MultiStepFormPage() {
  return (
    <ExamplePageShell
      title="Multi-Step Form"
      description="Organization registration form with per-step Zod validation, progress tracking, and reCAPTCHA support."
      registryFile="multistep-form-template.json"
      codeFiles={["components/examples/form-ui-multistep-template.tsx"]}
    >
      <CreateOrgForm />
    </ExamplePageShell>
  )
}
