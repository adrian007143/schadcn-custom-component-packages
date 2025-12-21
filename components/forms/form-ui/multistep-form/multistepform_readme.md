🧙‍♂️ MultiStepForm (V2) Documentation

A powerful, strictly typed, and responsive wizard component built on top of React Hook Form, Zod, and Shadcn UI. It handles validation per step, progress tracking, responsive layouts (sidebar vs. top bar), and extensive styling variants.

🚀 Features

Strict Type Safety: Fully generic; validates field names against your Zod schema.

Per-Step Validation: Users cannot proceed to the next step until current fields are valid.

Responsive Layouts:

Desktop: Optional Sidebar navigation.

Mobile: Top bar stepper or progress bar.

Grid System: Built-in support for grid-2, grid-3, auto-fit, etc.

Visual Variants: Supports card, outline, and ghost modes.

Icon Support: Pass Lucide (or any ReactNode) icons directly to inputs.

Auto Scroll: Automatically scrolls to top when changing steps.

📦 Import

```tsx
import { MultiStepForm } from "@/components/forms/form-ui/multistep-form/MultiStepForm-V2";
import { FormFieldType } from "@/components/forms/form-field-v2/constants";

```

🛠️ Props API

```tsx
Prop	Type	Required	Description
schema	ZodType<T>	✅	The Zod schema for the entire form.
defaultValues	DefaultValues<T>	✅	Initial values for the form.
steps	MultiStepFormStep[]	✅	Configuration for steps, sections, and fields.
onSubmit	(values, form) => void	✅	Handler called only after the final step is valid.
variant	'card' | 'outline' | 'ghost'	❌	Visual style. Default: 'card'.
layoutMode	'auto' | 'horizontal' | 'vertical'	❌	horizontal = Sidebar (Desktop). vertical = Top bar. auto = Responsive.
mode	'CREATE' | 'UPDATE'	❌	Changes button text (Submit vs Save).
stickyFooter	boolean	❌	If true, buttons stick to the bottom of the screen.
recaptcha	boolean	❌	Enables Google reCAPTCHA on the final step.
showProgressBar	boolean	❌	Shows percentage bar at the top. Default: true.

```

🧱 Configuration Objects
1. MultiStepFormStep

Defines a single step in the wizard.

```tsx
{
  title: string;          // Step title (displayed in sidebar/topbar)
  description?: string;   // Subtitle
  layout?: "stack" | "grid-2" | "grid-3" | ...; // Default layout for fields
  
  // Option A: Direct Fields
  fields?: FormFieldConfig[]; 

  // Option B: Grouped Sections
  sections?: FormSection[];
}

```

2. FormFieldConfig

Defines a single input.

```ts
{
  name: "email",                  // Must match Zod Schema key
  fieldType: FormFieldType.INPUT, // Enum: INPUT, PASSWORD, SELECT, etc.
  label: "Email Address",
  type: "email",                  // HTML Attribute (text, email, number)
  icon: <Mail className="size-4"/>, // Lucide Icon
  required: true,
  height: "sm" | "md" | "lg",
  
  // For Selects
  data: [{ label: "A", value: "a" }],
  labelKey: "label",
  valueKey: "value"
}

```
🎨 Visual Variants

You can control the look of the form container using the variant prop.

1. card (Default)

Standard white background with border, shadow, and padding.

<MultiStepForm variant="card" ... />

2. outline

Transparent background with a border. Good for clean UIs.

<MultiStepForm variant="outline" ... />

3. ghost

No border, no shadow, no background. Perfect when embedding the form inside a Modal or another Card.

<MultiStepForm variant="ghost" ... />

💻 Usage Example

Here is a complete example of a user registration wizard.

```tsx

"use client";

import { z } from "zod";
import { User, Mail, Lock, Briefcase } from "lucide-react";
import { MultiStepForm } from "@/components/forms/form-ui/multistep-form/MultiStepForm-V2";
import { FormFieldType } from "@/components/forms/form-field-v2/constants";

// 1. Define Schema
const Schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  role: z.string(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof Schema>;

export default function RegistrationPage() {
  
  const handleSubmit = (values: FormValues, form: any) => {
    console.log("Success:", values);
    form.reset();
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <MultiStepForm<FormValues>
        schema={Schema}
        defaultValues={{ firstName: "", lastName: "", email: "", role: "", password: "" }}
        onSubmit={handleSubmit}
        variant="card"             // Style variant
        layoutMode="horizontal"    // Sidebar layout
        FormLayout="grid-2"        // Default all steps to 2 columns
        steps={[
          // STEP 1: Personal Info
          {
            title: "Identity",
            description: "Who are you?",
            fields: [
              {
                name: "firstName",
                label: "First Name",
                fieldType: FormFieldType.INPUT,
                icon: <User className="size-4" />,
                required: true,
              },
              {
                name: "lastName",
                label: "Last Name",
                fieldType: FormFieldType.INPUT,
                icon: <User className="size-4" />,
                required: true,
              },
              {
                name: "email",
                label: "Email",
                fieldType: FormFieldType.INPUT,
                type: "email",
                icon: <Mail className="size-4" />,
                required: true,
                // Span full width in a grid-2 layout
                className: "col-span-2", 
              },
            ],
          },

          // STEP 2: Professional Info
          {
            title: "Role",
            description: "What do you do?",
            layout: "stack", // Override to single column
            fields: [
              {
                name: "role",
                label: "Job Role",
                fieldType: FormFieldType.SELECT,
                placeholder: "Select a role",
                icon: <Briefcase className="size-4" />,
                data: [
                  { label: "Developer", value: "dev" },
                  { label: "Designer", value: "des" },
                ],
                labelKey: "label",
                valueKey: "value",
              },
            ],
          },

          // STEP 3: Security
          {
            title: "Security",
            description: "Secure your account",
            fields: [
              {
                name: "password",
                label: "Password",
                fieldType: FormFieldType.PASSWORD,
                icon: <Lock className="size-4" />,
                required: true,
                className: "col-span-2",
              },
            ],
          },
        ]}
      />
    </div>
  );
}

```
💡 Tips & Tricks

Grid Spanning: If you use FormLayout="grid-2", but want a specific field (like an address or description) to take up the whole width, pass className: "col-span-2" (or col-span-full) inside that field's config.

Validation: If a user clicks "Next" but nothing happens, it means Zod validation failed for the current step. The fields will turn red/show errors.

Enter Key: Pressing Enter in an input will automatically trigger the "Next" button logic.

Icons: Always add className="size-4" or w-4 h-4 to your Lucide icons to ensure they fit perfectly inside the input.