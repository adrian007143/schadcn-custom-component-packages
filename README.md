# FormKitCN

> **Schema-driven component toolkit for building production-ready forms, tables, and UI systems in React — powered by shadcn/ui.**

📖 **[Documentation](https://formkitcn.pro)** · 🧩 **[Components](https://formkitcn.pro/blocks)** · 🎨 **[Examples](https://formkitcn.pro/blocks)** · ⭐ **[GitHub](https://github.com/adrian007143/schadcn-custom-component-packages)**

---

## What is FormKitCN?

FormKitCN is a developer-first toolkit that lets you install production-ready blocks into any Next.js project with a single command. Every block is schema-driven, type-safe, and standalone — no vendor lock-in.

```bash
npx shadcn@latest add https://formkitcn.pro/r/form-field.json
```

---

## Available Packages

| Package | Install Key | Description |
|---|---|---|
| **FieldRenderer** | `form-field.json` | 25+ field types — input, select, date, file, OTP, masked, currency, and more |
| **SchemaForm** | `form-dynamic-template.json` | Schema-driven form with Zod validation and CREATE / UPDATE / VIEW modes |
| **StepForm** | `multistep-form-template.json` | Multi-step form with per-step validation, progress bar, and reCAPTCHA |
| **Form Layout** | `form-layout.json` | `FormSection`, `FormColumns`, `FormRow`, `FormActions`, `FormFieldWrapper` |
| **Data Table** | `data-table-dynamic.json` | Inline editing, drag-and-drop rows/columns, faceted filtering, column visibility |
| **Redux Tool** | `redux-methods-tool.json` | Store, reducers, StoreProvider, localStorage persistence |
| **Theme Preset Tool** | `theme-preset-tool.json` | 12 OKLCH presets, palette generator, per-token editor, radius control, CSS/JSON export |

---

## Quick Install

```bash
# Field renderer — 25+ field types
npx shadcn@latest add https://formkitcn.pro/r/form-field.json

# Schema-driven complete form
npx shadcn@latest add https://formkitcn.pro/r/form-dynamic-template.json

# Multi-step form
npx shadcn@latest add https://formkitcn.pro/r/multistep-form-template.json

# Form layout primitives
npx shadcn@latest add https://formkitcn.pro/r/form-layout.json

# Dynamic data table
npx shadcn@latest add https://formkitcn.pro/r/data-table-dynamic.json

# Redux store scaffold
npx shadcn@latest add https://formkitcn.pro/r/redux-methods-tool.json

# Theme preset tool (standalone — no Redux required)
npx shadcn@latest add https://formkitcn.pro/r/theme-preset-tool.json
```

---

## Usage Examples

### FieldRenderer — render any field type

```tsx
import { FieldRenderer } from "@/components/forms/core"
import { useForm } from "react-hook-form"

const { control } = useForm()

<FieldRenderer
  field={{ name: "email", type: "EMAIL", label: "Email address", required: true }}
  control={control}
/>
```

**Supported types:** `TEXT` `EMAIL` `PASSWORD` `PHONE` `NUMBER` `TEXTAREA` `SELECT` `COMMAND` `ASYNC_SELECT` `CHECKBOX` `SWITCH` `RADIO` `DATE` `DATETIME` `DATERANGE` `FILE` `CURRENCY` `SLIDER` `OTP` `MASKED` `HIDDEN` `RECAPTCHA`

---

### SchemaForm — schema-driven complete form

```tsx
import { SchemaForm } from "@/components/forms/form-ui/standard-form"
import { z } from "zod"

const schema = [
  { name: "name",  type: "TEXT",  label: "Full name",  required: true },
  { name: "email", type: "EMAIL", label: "Email",       required: true },
]

const zodSchema = z.object({
  name:  z.string().min(2),
  email: z.string().email(),
})

<SchemaForm
  schema={schema}
  zodSchema={zodSchema}
  onSubmit={(values) => console.log(values)}
  submitLabel="Send"
/>
```

---

### StepForm — multi-step form

```tsx
import { StepForm } from "@/components/forms/form-ui/multistep-form"

const schema = [
  { name: "name",    type: "TEXT",  label: "Full name" },
  { name: "email",   type: "EMAIL", label: "Email" },
  { name: "plan",    type: "SELECT", label: "Plan", options: [...] },
  { name: "payment", type: "TEXT",  label: "Card number" },
]

const steps = [
  { title: "Account",  fields: ["name", "email"] },
  { title: "Plan",     fields: ["plan"] },
  { title: "Billing",  fields: ["payment"] },
]

<StepForm
  schema={schema}
  steps={steps}
  onSubmit={(values) => console.log(values)}
  showProgressBar
/>
```

---

### Theme Preset Tool — live theme switching

```tsx
// app/layout.tsx
import { AppProviders } from "@/components/providers/AppProviders"
import { AppShell }     from "@/components/site/AppShell"
import { AppHeader }    from "@/components/site/AppHeader"

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className="flex min-h-dvh flex-col bg-background font-sans text-foreground antialiased">
        <AppProviders defaultTheme="dark">
          <AppShell header={<AppHeader brand="My App" />}>
            {children}
          </AppShell>
        </AppProviders>
      </body>
    </html>
  )
}
```

```tsx
// Anywhere in your app
import { dispatchThemeAction } from "@/components/theme/dispatchThemeAction"

dispatchThemeAction("setThemePreset", "midnight")
dispatchThemeAction("setRadius", 0.5)
dispatchThemeAction("setThemeBuilderOpen", true)
```

**Available presets:** `default` `midnight` `forest` `ocean` `sunset` `nordic` `rosewood` `lavender` `graphite` `aurora` `copper` `jade`

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Next.js 15+ (App Router) + TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Forms | React Hook Form + Zod |
| Tables | TanStack Table v8 + dnd-kit |
| State | Redux (`react-redux-methods`) |
| Theme | OKLCH color system (standalone store) |

---

## Project Structure

```bash
app/
├── docs/          # MDX documentation pages
└── blocks/        # Interactive block previews

components/
├── forms/
│   ├── core/              # FieldRenderer (25+ field types)
│   └── form-ui/           # SchemaForm, StepForm
├── theme/                 # ThemeBuilder, ThemeManager, presets
├── providers/             # AppProviders
└── site/                  # AppShell, AppHeader, ThemeToggle

lib/
├── theme/                 # types, presets, utils, theme-store
└── registry-manifest.ts   # all registry items

redux/
└── reducers/              # notification, sidebar, todo, theme

registry.template.json     # registry source of truth
public/r/                  # built registry JSON files
```

---

## Local Development

```bash
git clone https://github.com/adrian007143/schadcn-custom-component-packages
cd schadcn-custom-component-packages
npm install
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000).

### Rebuild the registry

After modifying any component source file:

```bash
npm run registry:build
```

Output goes to `public/r/*.json`.

---

## Documentation

Full documentation, live examples, and install guides at **[formkitcn.pro](https://formkitcn.pro)**.

| Page | URL |
|---|---|
| Getting Started | [formkitcn.pro/docs/getting-started](https://formkitcn.pro/docs/getting-started) |
| FieldRenderer | [formkitcn.pro/docs/form-field](https://formkitcn.pro/docs/form-field) |
| SchemaForm | [formkitcn.pro/docs/form-builder](https://formkitcn.pro/docs/form-builder) |
| StepForm | [formkitcn.pro/docs/multistep-form](https://formkitcn.pro/docs/multistep-form) |
| Form Layout | [formkitcn.pro/docs/form-layout](https://formkitcn.pro/docs/form-layout) |
| Data Table | [formkitcn.pro/docs/data-table](https://formkitcn.pro/docs/data-table) |
| Redux Tool | [formkitcn.pro/docs/redux](https://formkitcn.pro/docs/redux) |
| Theme Preset Tool | [formkitcn.pro/docs/theme-builder](https://formkitcn.pro/docs/theme-builder) |

---

## License

MIT — free for personal and commercial use.
