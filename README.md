# FormKitCN

A schema-driven component toolkit for building production-ready forms, tables, and UI systems in React — powered by shadcn/ui.

## Features

| Feature | Description |
|---|---|
| **17+ Field Types** | Input, password, textarea, date picker, select, async-select, phone, currency, percent, masked, file upload, switch, checkbox, and more |
| **FormBuilderStandard** | Schema-driven form builder with Zod validation, CREATE/UPDATE/VIEW modes |
| **Multi-Step Forms** | Per-step validation, progress tracking, reCAPTCHA, flexible layouts |
| **Form Layout Primitives** | `FormSection`, `FormColumns`, `FormRow`, `FormActions`, `FormFieldWrapper` |
| **Dynamic Data Table** | Inline editing, drag-and-drop rows/columns, faceted filtering, column visibility |
| **Redux Toolkit** | Store, reducers, StoreProvider, localStorage persistence |
| **Registry-Based** | Every block installs directly into your project via the shadcn CLI |

## Quick Install

Install any block with one command:

```bash
# Dynamic form field system (17+ field types)
npx shadcn@latest add https://schadcn-custom-component-packages.vercel.app/r/form-field.json

# Form layout primitives
npx shadcn@latest add https://schadcn-custom-component-packages.vercel.app/r/form-layout.json

# Multi-step form
npx shadcn@latest add https://schadcn-custom-component-packages.vercel.app/r/multistep-form-template.json

# Dynamic data table
npx shadcn@latest add https://schadcn-custom-component-packages.vercel.app/r/data-table-dynamic.json

# Redux setup
npx shadcn@latest add https://schadcn-custom-component-packages.vercel.app/r/redux-methods-tool.json
```

## Dev Setup

```bash
npm install
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui
- React Hook Form + Zod
- TanStack Table v8
- dnd-kit
- Redux (`react-redux-methods`)

## Registry

Browse all available blocks at `/blocks` or install directly from the registry URLs above.
