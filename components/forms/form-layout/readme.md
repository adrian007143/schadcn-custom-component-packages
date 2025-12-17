---

# 📘 **Form Layout System — README**

A modern, flexible, and scalable UI layout framework for building clean, consistent, and enterprise-grade forms in **Next.js + ShadCN UI + React Hook Form**.

This system eliminates inconsistent spacing, misaligned fields, and messy grid layouts — while providing a beautiful, fully responsive structure for any form complexity.

---

# 🚀 Features

* 🎨 **Consistent layout system** for all forms
* 🧩 Modular, component-based architecture
* 📐 Unified spacing, sizing, and label alignment
* 📱 Responsive column layouts (1–4 columns)
* 🔗 Perfect integration with `react-hook-form`
* ⚡ Works seamlessly with `CustomFormField`
* 🪝 Supports advanced fields (`AsyncSelect`, currency, masked, etc.)
* ♿ Accessible & semantic markup
* 🔄 Supports nested layouts and multiple sections
* ✨ Professional form appearance without manual CSS

---

# 📂 Folder Structure

```
components/
│── forms/
│     ├── layout/
│     │     ├── FormLayout.tsx
│     │     ├── FormSection.tsx
│     │     ├── FormColumns.tsx
│     │     ├── FormFieldWrapper.tsx
│     │     ├── FormRow.tsx
│     │     ├── FormDivider.tsx
│     │     ├── FormActions.tsx
│     │
│     ├── form-field-v3/
│     │     ├── CustomFormField.tsx
│     │     ├── render-input.tsx
│     │     ├── async-select.tsx
│     │     ├── types.ts
│     │     ├── constants.ts
```

---

# 🧱 Core Components Overview

### Located under:

```
components/forms/layout/
```

## **1. `<FormLayout>`**

Top-level wrapper for the entire form.

## **2. `<FormSection>`**

Displays a section title + description + grouped fields.

## **3. `<FormColumns>`**

Creates 1–4 responsive columns.

## **4. `<FormRow>`**

A horizontal row of fields.

## **5. `<FormFieldWrapper>`**

Wraps a single field (label + input + description + error).

## **6. `<FormDivider>`**

A visual divider between sections.

## **7. `<FormActions>`**

Submit/reset button container.

---

# ✨ Example Usage

```tsx
import {
  FormLayout,
  FormSection,
  FormColumns,
  FormActions,
} from "@/components/forms/layout";

import { CustomFormField, FormFieldType } from "@/components/forms/form-field-v3";
```

### Full Example

```tsx
<FormLayout>
  <FormSection
    title="User Profile"
    description="Select or create a user and add personal details."
  >
    <FormColumns columns={2}>
      <CustomFormField
        fieldType={FormFieldType.ASYNC_SELECT}
        name="userID"
        label="Select User"
        placeholder="Search user..."
        data={DUMMY_USERS}
        selectLabelKey={{
          primary: { key: "name" },
          columns: [{ key: "email" }, { key: "phone" }],
        }}
        valueKey="id"
      />

      <CustomFormField
        fieldType={FormFieldType.INPUT}
        name="name"
        label="Full Name"
      />
    </FormColumns>
  </FormSection>

  <FormSection
    title="Contact Information"
    description="Email, phone, and monetary fields."
  >
    <FormColumns columns={2}>
      <CustomFormField fieldType={FormFieldType.PHONE_INPUT} name="mobile" label="Mobile Number" />
      <CustomFormField fieldType={FormFieldType.INPUT} name="email" label="Email Address" />
    </FormColumns>
  </FormSection>

  <FormSection title="Additional Details">
    <FormColumns columns={2}>
      <CustomFormField fieldType={FormFieldType.SELECT} name="role_id" label="User Role" />
      <CustomFormField fieldType={FormFieldType.MASKED} name="tin" label="Tax ID" />
    </FormColumns>

    <FormColumns columns={1}>
      <CustomFormField fieldType={FormFieldType.PERCENT} name="rate" label="Rate (%)" />
    </FormColumns>
  </FormSection>

  <FormActions>
    <Button className="w-full" type="submit">Submit Form</Button>
  </FormActions>
</FormLayout>
```

---

# 📐 Layout Patterns

### **One Column**

```tsx
<FormColumns columns={1}>
  <CustomFormField ... />
</FormColumns>
```

### **Two Columns**

```tsx
<FormColumns columns={2}>
  <CustomFormField ... />
  <CustomFormField ... />
</FormColumns>
```

### **Three Columns**

```tsx
<FormColumns columns={3}>
  <CustomFormField ... />
  <CustomFormField ... />
  <CustomFormField ... />
</FormColumns>
```

### **Nested Layouts**

```tsx
<FormSection title="Advanced">
  <FormColumns columns={2}>
    ...
  </FormColumns>

  <FormColumns columns={1}>
    ...
  </FormColumns>
</FormSection>
```

---

# 🎯 Best Practices

✔ Use **FormSection** to group related fields
✔ Use **FormColumns** instead of manual CSS
✔ Keep each section small and descriptive
✔ Use **prefix** and **suffix** for icons
✔ Wrap your submit button using **FormActions**

---

# 👌 Upcoming Enhancements

* Automatic layout generator
* Schema → layout auto-mapping
* Form density modes (compact/comfortable)
* Visual debug mode for spacing

---

# 📄 License

Free to use in all your projects.

---