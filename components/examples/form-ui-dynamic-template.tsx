"use client";

import z from "zod";
import {
  BadgeCheckIcon,
  Building2Icon,
  MailIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react";

import { FormFieldType } from "@/components/forms/core";
import { SchemaForm } from "@/components/forms/patterns/SchemaForm";
import { showSuccess } from "@/lib/helper/toast-icon";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DynamicFormSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  email: z.string().email("Enter a valid email address."),
  accountType: z.enum(["personal", "business"]),
  company: z.string().optional(),
  teamSize: z.number().min(1, "Team size must be at least 1."),
  satisfaction: z.number().min(0).max(100),
  verificationCode: z.string().length(6, "Verification code must be 6 digits."),
  interests: z.array(z.string()).min(1, "Select at least one use case."),
  newsletter: z.boolean(),
  assistantName: z.string().optional(),
  notes: z.string().min(10, "Share a bit more context."),
});

type DynamicFormValues = z.infer<typeof DynamicFormSchema>;

const accountOptions = [
  { label: "Personal project", value: "personal" },
  { label: "Business workflow", value: "business" },
];

const interestOptions = [
  { label: "Lead capture", value: "lead-capture" },
  { label: "Client onboarding", value: "client-onboarding" },
  { label: "Internal ops", value: "internal-ops" },
  { label: "Billing forms", value: "billing-forms" },
  { label: "Approval workflows", value: "approval-workflows" },
];

export default function DynamicFormTemplateExample() {
  const handleSubmit = async (values: DynamicFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    showSuccess({
      message: `Saved ${values.accountType} workflow for ${values.fullName}.`,
    });
  };

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <SparklesIcon className="size-5" />
        </div>
        <div className="space-y-1">
          <CardTitle>Dynamic Schema Form</CardTitle>
          <CardDescription>
            Demonstrates the new Base UI-backed field types, conditional
            rendering, and responsive column spans in one schema.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <SchemaForm<DynamicFormValues>
          schema={DynamicFormSchema}
          defaultValues={{
            fullName: "Adrian Santos",
            email: "adrian@example.com",
            accountType: "business",
            company: "FormKitCN Studio",
            teamSize: 8,
            satisfaction: 72,
            verificationCode: "482931",
            interests: ["client-onboarding", "approval-workflows"],
            newsletter: true,
            assistantName: "Nina",
            notes:
              "We need a schema-driven onboarding flow that scales across teams.",
          }}
          sections={[
            {
              title: "Workspace profile",
              description:
                "Mix standard inputs with the new radio, stepper, slider, OTP, and multi-select controls.",
              layout: "grid-3",
              fields: [
                {
                  name: "fullName",
                  label: "Owner name",
                  fieldType: FormFieldType.INPUT,
                  placeholder: "Jane Doe",
                  required: true,
                  colSpan: 2,
                },
                {
                  name: "email",
                  label: "Work email",
                  fieldType: FormFieldType.INPUT,
                  type: "email",
                  required: true,
                  placeholder: "team@example.com",
                },
                {
                  name: "accountType",
                  label: "Workspace type",
                  description:
                    "Conditional fields below react to this selection immediately.",
                  fieldType: FormFieldType.RADIO_GROUP,
                  data: accountOptions,
                  radioOrientation: "horizontal",
                  colSpan: "full",
                },
                {
                  name: "company",
                  label: "Company name",
                  fieldType: FormFieldType.INPUT,
                  placeholder: "FormKitCN Studio",
                  prefix: <Building2Icon className="size-4" />,
                  show: (values) => values.accountType === "business",
                },
                {
                  name: "teamSize",
                  label: "Team size",
                  description: "Styled number stepper with min/max bounds.",
                  fieldType: FormFieldType.NUMBER,
                  numberMin: 1,
                  numberMax: 500,
                  numberStep: 1,
                },
                {
                  name: "satisfaction",
                  label: "Migration progress",
                  description: "Slider stays fully controlled through react-hook-form.",
                  fieldType: FormFieldType.SLIDER,
                  sliderMin: 0,
                  sliderMax: 100,
                  sliderStep: 1,
                  showSliderValue: true,
                },
                {
                  name: "verificationCode",
                  label: "Verification code",
                  description: "Segmented OTP entry with paste and keyboard support.",
                  fieldType: FormFieldType.OTP,
                  otpLength: 6,
                  colSpan: 2,
                },
                {
                  name: "interests",
                  label: "Primary use cases",
                  description: "Multi-select with badge chips and selection limits.",
                  fieldType: FormFieldType.MULTI_SELECT,
                  data: interestOptions,
                  maxSelected: 3,
                  colSpan: "full",
                },
                {
                  name: "newsletter",
                  label: "Enable rollout assistant",
                  description:
                    "Toggles a follow-up field using the new `show` renderer hook.",
                  fieldType: FormFieldType.SWITCH,
                  colSpan: "full",
                },
                {
                  name: "assistantName",
                  label: "Assistant name",
                  fieldType: FormFieldType.INPUT,
                  placeholder: "Nina",
                  prefix: <BadgeCheckIcon className="size-4" />,
                  show: (values) => values.newsletter,
                },
                {
                  name: "notes",
                  label: "Implementation notes",
                  fieldType: FormFieldType.TEXTAREA,
                  placeholder: "Add rollout context, constraints, or integration notes.",
                  colSpan: "full",
                  textareaProps: {
                    rows: 5,
                  },
                },
              ],
            },
          ]}
          buttons={{
            save: {
              label: "Save workflow",
              submit: true,
              loadingLabel: "Saving workflow...",
              iconLeft: <ShieldCheckIcon className="size-4" />,
              onSubmit: handleSubmit,
            },
            notify: {
              label: "Notify team",
              submit: true,
              variant: "outline",
              iconLeft: <MailIcon className="size-4" />,
              onSubmit: handleSubmit,
            },
          }}
          buttonLayout="inline"
        />
      </CardContent>
    </Card>
  );
}
