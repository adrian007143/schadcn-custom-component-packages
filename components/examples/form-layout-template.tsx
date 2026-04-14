"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, FileText, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FieldRenderer, FormFieldType } from "@/components/forms/core";
import { FieldGroup } from "@/components/forms/layout/FieldGroup";
import { FormActionBar } from "@/components/forms/layout/FormActionBar";
import { FormGrid } from "@/components/forms/layout/FormGrid";
import { FormSection } from "@/components/forms/layout/FormSection";

const DUMMY_USERS = [
  { id: 1, name: "Juan Dela Cruz", email: "jdelacruz@example.com", phone: "123-456-7890" },
  { id: 2, name: "Maria Santos", email: "mariasantos@example.com", phone: "123-456-7890" },
  { id: 3, name: "Pedro Reyes", email: "pereyes@example.com", phone: "123-456-7890" },
  { id: 4, name: "Anna Marie Velasquez", email: "anna@example.com", phone: "123-456-7890" },
  { id: 5, name: "John Mark Evangelista", email: "john@example.com", phone: "123-456-7890" },
  { id: 6, name: "Catherine Cruz", email: "catherine@example.com", phone: "123-456-7890" },
];

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
  name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
  email: z.email(),
  mobile: z.string().min(13, { message: "Mobile number is required" }).max(13, {
    message: "Mobile number must be 11 digits long",
  }),
  date_of_birth: z.date().optional(),
  amount: z.number().optional(),
  tin: z.string().optional(),
  role_id: z.string().optional(),
  rate: z.number().optional(),
  active: z.boolean().optional(),
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
    <div className="rounded-lg border bg-background p-10 shadow-md">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-10">
          <FieldGroup orientation="responsive" className="space-y-10">
            <FormSection
              title="User Profile"
              description="Select or create a user and add basic personal details."
            >
              <FormGrid columns={2}>
                <FieldRenderer
                  control={form.control}
                  name="userID"
                  fieldType={FormFieldType.ASYNC_SELECT}
                  label="Select User"
                  placeholder="Search user..."
                  data={DUMMY_USERS}
                  valueKey="id"
                  selectLabelKey={{
                    primary: { key: "name" },
                    columns: [{ key: "name" }, { key: "email" }, { key: "phone" }],
                  }}
                  onAddNew={() => console.log("Add new user")}
                  addNewLabel="add new user"
                  iconSearch
                  borderless
                  height="md"
                />
                <FieldRenderer
                  control={form.control}
                  name="name"
                  fieldType={FormFieldType.INPUT}
                  label="Full Name"
                  placeholder="John Doe"
                  prefix={<Users className="h-4 w-4" />}
                  required
                />
              </FormGrid>
            </FormSection>

            <FormSection
              title="Contact & Financial Information"
              description="Mobile, email, and monetary input fields."
              className="space-y-4"
            >
              <FormGrid columns={2}>
                <FieldRenderer
                  control={form.control}
                  name="mobile"
                  fieldType={FormFieldType.PHONE_INPUT}
                  label="Mobile Number"
                  placeholder="912 345 6789"
                  required
                />
                <FieldRenderer
                  control={form.control}
                  name="amount"
                  fieldType={FormFieldType.CURRENCY}
                  prefix="₱"
                  label="Amount"
                  placeholder="0.00"
                  decimalPlaces={2}
                  thousandSeparator
                />
              </FormGrid>

              <FormGrid columns={2}>
                <FieldRenderer
                  control={form.control}
                  name="email"
                  fieldType={FormFieldType.INPUT}
                  label="Email Address"
                  placeholder="yourname@example.com"
                  prefix={<Mail className="h-4 w-4" />}
                />
                <FieldRenderer
                  control={form.control}
                  name="date_of_birth"
                  fieldType={FormFieldType.DATE_PICKER}
                  label="Date of Birth"
                  required
                />
              </FormGrid>
            </FormSection>

            <FormSection
              title="Additional Details"
              description="Role selection, TIN number, and percentage rate."
            >
              <FormGrid columns={2}>
                <FieldRenderer
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
                <FieldRenderer
                  control={form.control}
                  name="tin"
                  fieldType={FormFieldType.MASKED}
                  label="Tax Identification Number"
                  mask="###-###-###-###"
                  placeholder="123-456-789-000"
                  prefix={<FileText className="h-4 w-4" />}
                />
              </FormGrid>

              <FormGrid columns={2}>
                <FieldRenderer
                  control={form.control}
                  name="rate"
                  fieldType={FormFieldType.PERCENT}
                  label="Rate (%)"
                  placeholder="0%"
                  textAlign="right"
                  percentDecimalPlaces={2}
                />
                <FieldRenderer
                  control={form.control}
                  name="active"
                  fieldType={FormFieldType.SWITCH}
                  label="Is Active"
                />
              </FormGrid>

              <FieldRenderer
                control={form.control}
                name="active"
                fieldType={FormFieldType.SKELETON}
              />
            </FormSection>

            <FormActionBar>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Form"}
              </Button>
            </FormActionBar>
          </FieldGroup>
        </form>
      </FormProvider>
    </div>
  );
}
