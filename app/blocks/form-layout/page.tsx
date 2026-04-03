import FormLayoutComponent from "@/components/examples/form-layout-template"
import { ExamplePageShell } from "@/components/site/ExamplePageShell"

export default function FormLayoutPage() {
  return (
    <ExamplePageShell
      title="Form Layout"
      description="Composable form layout primitives — FormSection, FormColumns, FormRow, FormActions, and FormFieldWrapper."
      registryFile="form-layout.json"
    >
      <FormLayoutComponent />
    </ExamplePageShell>
  )
}
