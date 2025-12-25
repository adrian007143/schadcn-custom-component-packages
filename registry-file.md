```json
{
  "name": "formui-standard",
  "type": "registry:block",
  "title": "Form ui standard",
  "description": "Reusable form components for building structured and responsive forms.",
  "dependencies": [
    "react-hook-form",
    "zod",
    "@types/react-google-recaptcha",
    "react-google-recaptcha"
  ],
  "registryDependencies": ["form, form-field"],
  "files": [
    {
      "path": "registry/custom/templates/form-layout-template.tsx",
      "type": "registry:component",
      "target": "components/examples/form-layout-template.tsx"
    }
  ]
}
```

```json
