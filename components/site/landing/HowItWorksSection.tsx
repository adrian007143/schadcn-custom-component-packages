import { buildInstallCommand } from "@/lib/site-url"

interface HowItWorksSectionProps {
  baseUrl: string
}

export function HowItWorksSection({ baseUrl }: HowItWorksSectionProps) {
  const steps = [
    {
      number: "01",
      title: "Install a block",
      description: "Pick any block from the registry and add it to your project with one command.",
      code: buildInstallCommand(baseUrl, "form-field.json"),
      lang: "bash",
    },
    {
      number: "02",
      title: "Define your schema",
      description: "Write a Zod schema for your form. FormKitCN uses it for validation automatically.",
      code: `const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})`,
      lang: "ts",
    },
    {
      number: "03",
      title: "Render your form",
      description: "Pass your schema and field config to FormBuilderStandard and you're done.",
      code: `<FormBuilderStandard
  schema={schema}
  fields={fields}
  onSubmit={handleSubmit}
/>`,
      lang: "tsx",
    },
  ]

  return (
    <section className="py-20 border-t bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            How it works
          </h2>
          <p className="mt-3 text-muted-foreground">
            From install to working form in under a minute.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-6 left-[calc(33.33%+1rem)] right-[calc(33.33%+1rem)] h-px bg-border" />

          {steps.map((step, index) => (
            <div key={step.number} className="flex flex-col gap-5">
              {/* Step header */}
              <div className="flex items-center gap-4">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background shadow-sm">
                  <span className="text-xs font-bold text-primary">{step.number}</span>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium mb-0.5">
                    Step {index + 1}
                  </div>
                  <h3 className="font-semibold">{step.title}</h3>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>

              {/* Code block with header */}
              <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
                <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-2">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
                  </div>
                  <span className="text-xs text-muted-foreground font-mono ml-1">
                    {step.lang}
                  </span>
                </div>
                <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed">
                  <code>{step.code}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
