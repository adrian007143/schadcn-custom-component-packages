import {
  FormInput,
  Layers,
  Table2,
  ListOrdered,
  Database,
  Package,
} from "lucide-react"

const FEATURES = [
  {
    icon: FormInput,
    title: "17+ Field Types",
    description:
      "Input, password, textarea, date picker, select, async-select, phone, currency, percent, masked, file upload, and more.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: Layers,
    title: "Schema-Driven",
    description:
      "Define your form as a config array. FormBuilderStandard handles rendering, validation, and state automatically.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    icon: Table2,
    title: "Advanced Data Table",
    description:
      "Inline editing, drag-and-drop rows and columns, faceted filtering, column visibility, and custom cell types.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: ListOrdered,
    title: "Multi-Step Forms",
    description:
      "Per-step Zod validation, progress tracking, auto/horizontal/vertical layouts, sticky footer, and reCAPTCHA support.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },
  {
    icon: Database,
    title: "Redux Persistence",
    description:
      "Drop-in Redux store with localStorage sync. Includes example notification, sidebar, and todo slices.",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
  },
  {
    icon: Package,
    title: "Installable Blocks",
    description:
      "Every component is a shadcn registry block. One command installs the component directly into your project.",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Everything you need to ship forms fast
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            A complete toolkit — not just components. FormKitCN covers the full
            form lifecycle from schema to submission.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="group relative rounded-xl border bg-card p-6 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              >
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/3 group-hover:to-transparent transition-all duration-200" />
                <div className="relative flex flex-col gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg border ${feature.bg} ${feature.border}`}
                  >
                    <Icon className={`h-5 w-5 ${feature.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1.5">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
