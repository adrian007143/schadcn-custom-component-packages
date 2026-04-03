import { Badge } from "@/components/ui/badge"

const FIELD_TYPES = [
  "INPUT",
  "PASSWORD",
  "TEXTAREA",
  "DATE_PICKER",
  "SELECT",
  "SINGLE_SELECT",
  "COMMAND",
  "PHONE_INPUT",
  "CHECKBOX",
  "SWITCH",
  "CURRENCY",
  "PERCENT",
  "MASKED",
  "ASYNC_SELECT",
  "FILE_UPLOAD",
  "HIDDEN",
  "SKELETON",
]

export function FieldTypesSection() {
  return (
    <section className="py-14 border-t bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
          <div>
            <h2 className="text-lg font-semibold">Supported field types</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {FIELD_TYPES.length} field types out of the box
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {FIELD_TYPES.map((type) => (
            <Badge
              key={type}
              variant="outline"
              className="font-mono text-xs px-3 py-1 bg-background hover:bg-muted/50 transition-colors cursor-default"
            >
              {type}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  )
}
