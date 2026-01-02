"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { useState } from "react";

import { Users, Mail, FileText } from "lucide-react";

import { FormSection } from "@/components/forms/form-layout/FormSection";
import { FormFieldWrapper } from "@/components/forms/form-layout/FormFieldWrapper";
import { FormColumns } from "@/components/forms/form-layout/FormColumns";
import { FormFieldType } from "@/components/forms/form-field/constants";
import { DynamicFormField as CustomFormField } from "@/components/forms/form-field/DynamicFormField";
import { FormActions } from "@/components/forms/form-layout/FormActions";
import { toast } from "sonner";

// NEW LAYOUT SYSTEM

// Dummy data
const DUMMY_USERS = [
  {
    id: 1,
    name: "Juan Dela Cruz",
    email: "jdelacruz@example.com",
    phone: "123-456-7890",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "mariasantos@example.com",
    phone: "123-456-7890",
  },
  {
    id: 3,
    name: "Pedro Reyes",
    email: "pereyes@example.com",
    phone: "123-456-7890",
  },
  {
    id: 4,
    name: "Anna Marie Velasquez",
    email: "anna@example.com",
    phone: "123-456-7890",
  },
  {
    id: 5,
    name: "John Mark Evangelista",
    email: "john@example.com",
    phone: "123-456-7890",
  },
  {
    id: 6,
    name: "Catherine Cruz",
    email: "catherine@example.com",
    phone: "123-456-7890",
  },
];

export async function loadDummyUsers(query: string) {
  await new Promise((r) => setTimeout(r, 600));
  if (!query) return DUMMY_USERS;
  const lower = query.toLowerCase();
  return DUMMY_USERS.filter((u) => u.name.toLowerCase().includes(lower));
}

// Form validation schema

// add near the top of the file
const storedFileSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  type: z.string(),
  size: z.number(),
  data: z.string().optional(),
  url: z.string().optional(),
});

const formSchema = z.object({
  userID: z.number().optional(),
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  email: z.email(),
  mobile: z.string().optional(),
  date_of_birth: z.date().optional(),
  amount: z.number().optional(),
  tin: z.string().optional(),
  role_id: z.string().optional(),
  rate: z.number().optional(),
  active: z.boolean().optional(),
  // ✅ FILE UPLOAD
  attachments: z.array(storedFileSchema).optional(),
});

export default function FormComponent() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userID: 0,
      name: "",
      email: "",
      mobile: "",
      role_id: "",
      date_of_birth: undefined,
      amount: undefined,
      tin: "",
      rate: undefined,
      active: false,

      // ✅ default
      attachments: [],
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    console.log("Form submitted:", values);
    setTimeout(() => setIsLoading(false), 1000);
    toast.success("Form submitted successfully!", {
      description: "You can close this toast by clicking on the X button.",
    });
    form.reset();
  };

  return (
    <div className="border p-10 rounded-lg shadow-md bg-background">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-10 w-full"
        >
          <FormFieldWrapper orientation="responsive">
            {/* ----------------------------------------- */}
            {/* USER PROFILE SECTION */}
            {/* ----------------------------------------- */}
            <FormSection
              title="User Profile"
              description="Select or create a user and add basic personal details."
            >
              <FormColumns columns={2}>
                <CustomFormField
                  control={form.control}
                  name="userID"
                  fieldType={FormFieldType.ASYNC_SELECT}
                  label="Select User"
                  placeholder="Search user..."
                  data={DUMMY_USERS}
                  // loadOptions={loadDummyUsers}
                  valueKey="id"
                  selectLabelKey={{
                    primary: { key: "name" },
                    columns: [
                      { key: "name" },
                      { key: "email" },
                      { key: "phone" },
                    ],
                  }}
                  onAddNew={() => console.log("Add new user")}
                  addNewLabel="add new user"
                  iconSearch
                  borderless
                  height="md"
                />

                <CustomFormField
                  control={form.control}
                  name="name"
                  fieldType={FormFieldType.INPUT}
                  label="Full Name"
                  placeholder="John Doe"
                  prefix={<Users className="w-4 h-4" />}
                  required
                />
              </FormColumns>
            </FormSection>

            {/* ----------------------------------------- */}
            {/* CONTACT & FINANCIAL SECTION */}
            {/* ----------------------------------------- */}
            <FormSection
              title="Contact & Financial Information"
              description="Mobile, email, and monetary input fields."
              className="space-y-4"
            >
              <FormColumns columns={2}>
                <CustomFormField
                  control={form.control}
                  name="mobile"
                  fieldType={FormFieldType.PHONE_INPUT}
                  label="Mobile Number"
                  placeholder="912 345 6789"
                  required
                />

                <CustomFormField
                  control={form.control}
                  name="amount"
                  fieldType={FormFieldType.CURRENCY}
                  prefix="₱"
                  label="Amount"
                  placeholder="0.00"
                  decimalPlaces={2}
                  // trimTrailingZeros
                  thousandSeparator
                />
              </FormColumns>

              <FormColumns columns={2}>
                <CustomFormField
                  control={form.control}
                  name="email"
                  fieldType={FormFieldType.INPUT}
                  label="Email Address"
                  placeholder="yourname@example.com"
                  prefix={<Mail className="h-4 w-4" />}
                />

                <CustomFormField
                  control={form.control}
                  name="date_of_birth"
                  fieldType={FormFieldType.DATE_PICKER}
                  label="Date of Birth"
                  required
                />
              </FormColumns>
            </FormSection>

            {/* ----------------------------------------- */}
            {/* ADDITIONAL DETAILS SECTION */}
            {/* ----------------------------------------- */}
            <FormSection
              title="Additional Details"
              description="Role selection, TIN number, and percentage rate."
            >
              <FormColumns columns={2}>
                <CustomFormField
                  control={form.control}
                  name="role_id"
                  fieldType={FormFieldType.SELECT}
                  label="User Role"
                  data={[
                    { label: "Admin", value: "admin" },
                    { label: "Manager", value: "manager" },
                    { label: "Staff", value: "staff" },
                  ]}
                  prefix={<Users className="h-4 w-4" />}
                />

                <CustomFormField
                  control={form.control}
                  name="tin"
                  fieldType={FormFieldType.MASKED}
                  label="Tax Identification Number"
                  mask="###-###-###-###"
                  placeholder="123-456-789-000"
                  prefix={<FileText className="h-4 w-4" />}
                />
              </FormColumns>

              <FormColumns columns={2}>
                <CustomFormField
                  control={form.control}
                  name="rate"
                  fieldType={FormFieldType.PERCENT}
                  label="Rate (%)"
                  placeholder="0%"
                  textAlign="right"
                  percentDecimalPlaces={2}
                />
                <CustomFormField
                  control={form.control}
                  name="active"
                  fieldType={FormFieldType.SWITCH}
                  label="Is Active"

                  // placeholder="0%"
                  // textAlign="right"
                />
              </FormColumns>
              <CustomFormField
                control={form.control}
                name="active"
                fieldType={FormFieldType.SKELETON}

                // placeholder="0%"
                // textAlign="right"
              />
            </FormSection>
            {/* ACTIONS */}
            <FormActions>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Form"}
              </Button>
            </FormActions>
          </FormFieldWrapper>
        </form>
      </Form>
    </div>
  );
}
