const FIELD_TYPES = [
  { value: "INPUT", description: "Standard text input" },
  { value: "PASSWORD", description: "Password with show/hide toggle" },
  { value: "TEXTAREA", description: "Multi-line text area" },
  { value: "DATE_PICKER", description: "Calendar popover date picker" },
  { value: "SELECT", description: "Dropdown select from a data array" },
  { value: "SINGLE_SELECT", description: "Single-value selector with search" },
  { value: "COMMAND", description: "Command palette style selector" },
  { value: "ASYNC_SELECT", description: "Select with async loading + debounce" },
  { value: "PHONE_INPUT", description: "International phone with country flag" },
  { value: "CURRENCY", description: "Formatted currency with locale support" },
  { value: "PERCENT", description: "Percentage input with decimal control" },
  { value: "MASKED", description: "Input with a custom mask pattern" },
  { value: "CHECKBOX", description: "Checkbox with label" },
  { value: "SWITCH", description: "Toggle switch" },
  { value: "FILE_UPLOAD", description: "File upload with drag-and-drop" },
  { value: "HIDDEN", description: "Hidden field (no UI rendered)" },
  { value: "SKELETON", description: "Skeleton loader placeholder" },
]

export function FieldTypeGrid() {
  return (
    <div className="not-prose my-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
      {FIELD_TYPES.map((ft) => (
        <div
          key={ft.value}
          className="flex items-start gap-3 rounded-lg border bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/50"
        >
          <code className="shrink-0 rounded-md bg-primary/10 border border-primary/20 px-2 py-0.5 text-xs font-mono font-medium text-primary">
            {ft.value}
          </code>
          <span className="text-sm text-muted-foreground leading-snug pt-0.5">
            {ft.description}
          </span>
        </div>
      ))}
    </div>
  )
}
