---

# 📘 **FormFieldWrapper Documentation**

### *Part of the Form Layout System*

# components/forms/layout/FormFieldWrapper.tsx

---

## 🎯 **Purpose**

`FormFieldWrapper` is a **low-level layout component** responsible for rendering:

* **Label**
* **Required indicator**
* **Description**
* **Error message**
* **Consistent spacing**
* **Custom child layout**

It wraps a **single field**, ensuring that all form inputs—no matter their type (input, select, async select, masked, currency, etc.)—maintain consistent spacing, typography, and layout.

It mirrors the structure of the shadcn/ui `Field` component but integrates seamlessly with your fully-typed `CustomFormField` system.

---

# 📐 Anatomy

A typical usage:

```tsx
<FormFieldWrapper label="Email" description="We'll never share your email.">
  <CustomFormField
    fieldType={FormFieldType.INPUT}
    name="email"
    placeholder="yourname@example.com"
  />
</FormFieldWrapper>
```

Renders:

```
Email *
[input]
small description text
error message (auto)
```

---

# 🧩 Props

### **FormFieldWrapperProps**

```ts
interface FormFieldWrapperProps {
  label?: string;
  description?: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}
```

### Description of props

| Prop            | Type        | Description                                   |
| --------------- | ----------- | --------------------------------------------- |
| **label**       | `string`    | The text label displayed above the field      |
| **description** | `string`    | Optional helper/subtext                       |
| **required**    | `boolean`   | Adds an asterisk (`*`) after the label        |
| **error**       | `string`    | Validation message (usually from RHF)         |
| **children**    | `ReactNode` | The input or composite field to render inside |
| **className**   | `string`    | Extra wrapper styling                         |

---

# 🧱 Layout Structure

`FormFieldWrapper` uses the following structure:

```tsx
<div>
  <label>Label *</label>
  {children}
  <p>Description</p>
  <p>Error message</p>
</div>
```

Spacing between elements is controlled internally.

---

# 🎨 Styling Behavior

* Labels follow your global `text-sm font-medium`.
* Errors follow your shadcn `text-destructive` style.
* Wrapper automatically adjusts when nested inside:

  * `FormRow`
  * `FormColumns`
  * `FormSection`
  * `FormLayout`

No extra spacing conflicts.

---

# 💡 When Should You Use FormFieldWrapper?

### ✅ Automatically used (no manual import needed)

If you place fields inside:

* `<FormColumns>`
* `<FormRow>`
* `<FormSection>`
* `<FormLayout>`

You do **not** need to use `FormFieldWrapper`.
It is applied automatically.

### You manually use it when:

* You want a field **outside** standard rows/columns
* You want **custom wrappers**
* You want to add **custom prefixes, suffixes, inline elements**
* You want to place **multiple components in the same line**
* You want **fine-grained control** over spacing

---

# 📌 Examples

---

## ### 1. **Basic Manual Field**

```tsx
<FormFieldWrapper label="Full Name" required>
  <CustomFormField
    fieldType={FormFieldType.INPUT}
    name="name"
    placeholder="Juan Dela Cruz"
  />
</FormFieldWrapper>
```

---

## ### 2. **Field with Inline Custom Layout**

```tsx
<FormFieldWrapper
  label="Phone Number"
  description="Include the PH country code."
>
  <div className="flex gap-2">
    <span className="px-2 py-2 border rounded-md bg-muted flex items-center">+63</span>

    <CustomFormField
      fieldType={FormFieldType.PHONE_INPUT}
      name="mobile"
      className="flex-1"
    />
  </div>
</FormFieldWrapper>
```

---

## ### 3. **Manual layout for Masked TIN Input**

```tsx
<FormFieldWrapper
  label="Tax Identification Number"
  description="Format: 123-456-789-000"
>
  <CustomFormField
    fieldType={FormFieldType.MASKED}
    name="tin"
    mask="###-###-###-###"
  />
</FormFieldWrapper>
```

---

## ### 4. **Using FormFieldWrapper inside a grid**

```tsx
<FormColumns columns={2}>
  <FormFieldWrapper label="Amount">
    <CustomFormField
      fieldType={FormFieldType.CURRENCY}
      name="amount"
      prefix="₱"
    />
  </FormFieldWrapper>

  <FormFieldWrapper label="Rate (%)">
    <CustomFormField
      fieldType={FormFieldType.PERCENT}
      name="rate"
    />
  </FormFieldWrapper>
</FormColumns>
```

---

# 🔌 Integration with React Hook Form

You do NOT pass `error` manually.

The `FormLayout` and `CustomFormField` pipeline already extracts:

* `form.formState.errors[name]?.message`

…and passes it automatically to `FormFieldWrapper`.

So `error` is handled automatically.

---

# ⭐ Advanced Usage

## Component-level grouping

```tsx
<FormFieldWrapper label="Upload Document">
  <div className="flex items-center gap-2">
    <Input type="file" />
    <Button variant="secondary">Browse</Button>
  </div>
</FormFieldWrapper>
```

## Multi-line or complex content

```tsx
<FormFieldWrapper label="Address">
  <textarea className="min-h-24 w-full border rounded-md" />
</FormFieldWrapper>
```

---

# 📦 Summary

`FormFieldWrapper` is:

* The **foundation** of the form layout system
* Automatically applied in structured layouts
* Available for **manual fine-grained control**
* Fully integrated with `react-hook-form`
* Ensures **consistent spacing, typography, labels, and error messages**

---
