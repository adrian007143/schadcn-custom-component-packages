export interface RegistryItem {
  name: string
  title: string
  description: string
  category: "forms" | "data-table" | "redux" | "theme"
  dependencies: string[]
  registryFile: string
  previewPath?: string
  docsPath?: string
  isListed?: boolean
}

export const REGISTRY_ITEMS: RegistryItem[] = [
  {
    name: "form-field",
    title: "Dynamic Form Field",
    description:
      "Schema-driven dynamic form field system built on react-hook-form. Supports 17+ field types including currency, phone, async-select, date picker, file upload, and more.",
    category: "forms",
    dependencies: [
      "react-hook-form",
      "@hookform/resolvers",
      "react-phone-number-input",
      "lucide-react",
    ],
    registryFile: "form-field.json",
    previewPath: "/blocks/dynamic-form-field",
    docsPath: "/docs/form-field",
    isListed: true,
  },
  {
    name: "form-layout",
    title: "Form Layout",
    description:
      "Composable layout primitives for building structured and responsive forms. Includes FormSection, FormColumns, FormRow, FormActions, and more.",
    category: "forms",
    dependencies: [],
    registryFile: "form-layout.json",
    previewPath: "/blocks/form-layout",
    docsPath: "/docs/form-layout",
    isListed: true,
  },
  {
    name: "form-dynamic-template",
    title: "Login Form Template",
    description:
      "A starter login experience built with the shared FieldRenderer system, react-hook-form, Zod validation, and toast feedback.",
    category: "forms",
    dependencies: ["react-hook-form", "@hookform/resolvers", "zod"],
    registryFile: "form-dynamic-template.json",
    previewPath: "/blocks/login-form-template",
    docsPath: "/docs/form-builder",
    isListed: true,
  },
  {
    name: "multistep-form-template",
    title: "Multi-Step Form",
    description:
      "Reusable multi-step form with per-step validation, progress tracking, reCAPTCHA support, auto/horizontal/vertical layouts, and sticky footer.",
    category: "forms",
    dependencies: [
      "react-hook-form",
      "@hookform/resolvers",
      "zod",
      "react-google-recaptcha",
    ],
    registryFile: "multistep-form-template.json",
    previewPath: "/blocks/multistep",
    docsPath: "/docs/multistep-form",
    isListed: true,
  },
  {
    name: "form-template-01",
    title: "Form Template",
    description:
      "A starter form layout template using FormBuilderStandard with common field patterns, validation, and submit handling.",
    category: "forms",
    dependencies: ["react-hook-form", "@hookform/resolvers", "zod"],
    registryFile: "form-template-01.json",
    previewPath: "/blocks/form-layout",
    docsPath: "/docs/form-builder",
    isListed: false,
  },
  {
    name: "data-table-dynamic",
    title: "Dynamic Data Table",
    description:
      "A fully dynamic, editable, draggable data table built on TanStack Table. Supports inline editing, drag-and-drop rows/columns, faceted filtering, column visibility, and custom cells.",
    category: "data-table",
    dependencies: [
      "@tanstack/react-table",
      "@dnd-kit/core",
      "@dnd-kit/sortable",
      "@dnd-kit/modifiers",
      "date-fns",
    ],
    registryFile: "data-table-dynamic.json",
    previewPath: "/blocks/data-table-dynamic",
    docsPath: "/docs/data-table",
    isListed: true,
  },
  {
    name: "redux-methods-tool",
    title: "Redux Tool",
    description:
      "Complete Redux setup with store, reducers, StoreProvider, and localStorage persistence helpers. Includes example todo and notification slices.",
    category: "redux",
    dependencies: ["react-redux-methods"],
    registryFile: "redux-methods-tool.json",
    previewPath: "/blocks/redux-usage",
    docsPath: "/docs/redux",
    isListed: true,
  },
  {
    name: "theme-preset-tool",
    title: "Theme Preset Tool",
    description:
      "Interactive theme builder with 12 OKLCH presets, palette seed generator, random palette, per-token color editor, radius control, and CSS/JSON export. Standalone — no Redux required.",
    category: "theme",
    dependencies: ["lucide-react"],
    registryFile: "theme-preset-tool.json",
    previewPath: "/blocks/theme-builder",
    docsPath: "/docs/theme-builder",
    isListed: true,
  },
]

export const LISTED_REGISTRY_ITEMS = REGISTRY_ITEMS.filter(
  (item) => item.isListed !== false,
)
