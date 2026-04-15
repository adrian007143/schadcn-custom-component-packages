"use client";

import {
  BadgeCheckIcon,
  BellRingIcon,
  BriefcaseBusinessIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  FileTextIcon,
  KeyRoundIcon,
  Layers3Icon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { FormFieldType } from "@/components/forms/core";
import { SchemaForm } from "@/components/forms/patterns/SchemaForm";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const fieldGallerySchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  phone: z.string().min(8, "Enter a valid phone number."),
  bio: z.string().min(20, "Share a bit more context."),
  role: z.enum(["admin", "editor", "viewer"]),
  workspaceType: z.enum(["saas", "internal"]),
  region: z.string().min(1, "Pick a region."),
  workflow: z.string().min(1, "Choose a workflow."),
  teamLead: z.string().min(1, "Select a team lead."),
  useCases: z.array(z.string()).min(2, "Select at least two use cases."),
  launchDate: z.date().optional(),
  teamSize: z.number().min(1).max(500),
  monthlyBudget: z.number().nullable().optional(),
  completionRate: z.number().nullable().optional(),
  taxId: z.string().min(14, "Use the full masked tax id."),
  migrationProgress: z.number().min(0).max(100),
  verificationCode: z.string().length(6, "Verification code must be 6 digits."),
  assistantEnabled: z.boolean(),
  assistantName: z.string().optional(),
  notifyTeam: z.boolean(),
  attachment: z.unknown().nullable().optional(),
  termsAccepted: z.boolean().refine((value) => value, {
    message: "You must accept the terms to continue.",
  }),
});

type FieldGalleryValues = z.infer<typeof fieldGallerySchema>;

const roleOptions = [
  { label: "Admin", value: "admin" },
  { label: "Editor", value: "editor" },
  { label: "Viewer", value: "viewer" },
];

const workspaceOptions = [
  { label: "SaaS product", value: "saas" },
  { label: "Internal ops", value: "internal" },
];

const regionOptions = [
  { label: "Asia Pacific", value: "apac" },
  { label: "Europe", value: "emea" },
  { label: "North America", value: "amer" },
];

const workflowOptions = [
  { label: "Client onboarding", value: "client-onboarding" },
  { label: "Approval workflow", value: "approval-workflow" },
  { label: "Renewal intake", value: "renewal-intake" },
];

const useCaseOptions = [
  { label: "Lead capture", value: "lead-capture" },
  { label: "Client onboarding", value: "client-onboarding" },
  { label: "Billing forms", value: "billing-forms" },
  { label: "Renewals", value: "renewals" },
  { label: "Approval workflows", value: "approval-workflows" },
];

const teamLeadOptions = [
  {
    id: "pedro-reyes",
    name: "Pedro Reyes",
    email: "preyes@example.com",
    phone: "123-456-7890",
  },
  {
    id: "juan-dela-cruz",
    name: "Juan Dela Cruz",
    email: "jdelacruz@example.com",
    phone: "123-456-7890",
  },
  {
    id: "maria-santos",
    name: "Maria Santos",
    email: "mariasantos@example.com",
    phone: "123-456-7890",
  },
  {
    id: "anna-velasquez",
    name: "Anna Marie Velasquez",
    email: "anna@example.com",
    phone: "123-456-7890",
  },
  {
    id: "catherine-cruz",
    name: "Catherine Cruz",
    email: "catherine@example.com",
    phone: "123-456-7890",
  },
];

async function loadTeamLeads(query: string) {
  await new Promise((resolve) => setTimeout(resolve, 220));

  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return teamLeadOptions;
  }

  return teamLeadOptions.filter((member) =>
    [member.name, member.email, member.phone]
      .join(" ")
      .toLowerCase()
      .includes(normalized),
  );
}

export default function DynamicFormFieldShowcase() {
  const handleSubmit = async (values: FieldGalleryValues) => {
    await new Promise((resolve) => setTimeout(resolve, 900));

    toast.success(
      `Saved ${values.workspaceType} workspace for ${values.fullName} with ${values.useCases.length} use cases.`,
    );
  };

  return (
    <Card className="w-full max-w-6xl border-border/60 bg-card/95 shadow-sm">
      <CardHeader className="gap-5 border-b border-border/50 pb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Layers3Icon className="size-5" />
            </div>
            <div className="space-y-2">
              <CardTitle>Dynamic Field Gallery</CardTitle>
              <CardDescription className="max-w-3xl text-sm leading-6">
                A richer live preview of the FormKitCN field system. This demo
                shows the current interactive control surface through one
                schema-driven form, including overlays, formatted inputs, async
                search, and conditional rendering.
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">20 field types</Badge>
            <Badge variant="secondary">React Hook Form</Badge>
            <Badge variant="secondary">Zod validation</Badge>
            <Badge variant="secondary">Base UI overlays</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <SchemaForm<FieldGalleryValues>
          schema={fieldGallerySchema}
          defaultValues={{
            fullName: "Adrian Santos",
            email: "adrian@example.com",
            password: "supersecret",
            phone: "+639123456789",
            bio: "We want a polished field system preview that helps developers understand the supported control surface at a glance.",
            role: "editor",
            workspaceType: "saas",
            region: "apac",
            workflow: "client-onboarding",
            teamLead: "pedro-reyes",
            useCases: ["client-onboarding", "approval-workflows"],
            launchDate: new Date("2026-05-15T00:00:00.000Z"),
            teamSize: 24,
            monthlyBudget: 150000,
            completionRate: 0.62,
            taxId: "123-456-789-000",
            migrationProgress: 72,
            verificationCode: "482931",
            assistantEnabled: true,
            assistantName: "Nina",
            notifyTeam: true,
            attachment: null,
            termsAccepted: true,
          }}
          sections={[
            {
              title: "Core fields",
              description:
                "Text, password, textarea, phone, date, and file inputs using the shared FieldRenderer contract.",
              layout: "grid-3",
              fields: [
                {
                  name: "fullName",
                  label: "Full name",
                  fieldType: FormFieldType.INPUT,
                  placeholder: "Jane Doe",
                  prefix: <UserIcon className="size-4" />,
                  required: true,
                  colSpan: 2,
                },
                {
                  name: "email",
                  label: "Email",
                  fieldType: FormFieldType.INPUT,
                  type: "email",
                  placeholder: "team@example.com",
                  prefix: <MailIcon className="size-4" />,
                  required: true,
                },
                {
                  name: "password",
                  label: "Password",
                  fieldType: FormFieldType.PASSWORD,
                  placeholder: "Create a strong password",
                  prefix: <KeyRoundIcon className="size-4" />,
                  required: true,
                  colSpan: 2,
                },
                {
                  name: "phone",
                  label: "Phone",
                  fieldType: FormFieldType.PHONE_INPUT,
                  placeholder: "912 345 6789",
                },
                {
                  name: "launchDate",
                  label: "Launch date",
                  fieldType: FormFieldType.DATE_PICKER,
                  placeholder: "MM/DD/YYYY",
                  suffix: <CalendarDaysIcon className="size-4" />,
                },
                {
                  name: "attachment",
                  label: "Supporting file",
                  description:
                    "Optional upload for specs, screenshots, or SOP docs.",
                  fieldType: FormFieldType.FILE_UPLOAD,
                  colSpan: 2,
                  inputProps: {
                    accept: ".pdf,.png,.jpg,.jpeg",
                  },
                },
                {
                  name: "bio",
                  label: "Implementation brief",
                  fieldType: FormFieldType.TEXTAREA,
                  placeholder:
                    "Describe the workflow, rollout constraints, and where the form will be embedded.",
                  colSpan: "full",
                  textareaProps: {
                    rows: 5,
                  },
                },
              ],
            },
            {
              title: "Selection controls",
              description:
                "Covers select, combobox, command, async search, radio, multi-select, checkbox, and switch states.",
              layout: "grid-3",
              fields: [
                {
                  name: "role",
                  label: "Role",
                  fieldType: FormFieldType.SELECT,
                  data: roleOptions,
                  labelKey: "label",
                  valueKey: "value",
                  prefix: <ShieldCheckIcon className="size-4" />,
                },
                {
                  name: "region",
                  label: "Region",
                  fieldType: FormFieldType.SINGLE_SELECT,
                  data: regionOptions,
                  labelKey: "label",
                  valueKey: "value",
                  prefix: <MapPinIcon className="size-4" />,
                },
                {
                  name: "workflow",
                  label: "Workflow",
                  fieldType: FormFieldType.COMMAND,
                  data: workflowOptions,
                  labelKey: "label",
                  valueKey: "value",
                  prefix: <BriefcaseBusinessIcon className="size-4" />,
                },
                {
                  name: "workspaceType",
                  label: "Workspace type",
                  description:
                    "Radio groups can switch follow-up fields with the shared `show` hook.",
                  fieldType: FormFieldType.RADIO_GROUP,
                  data: workspaceOptions,
                  radioOrientation: "horizontal",
                  colSpan: "full",
                },
                {
                  name: "teamLead",
                  label: "Select user",
                  description:
                    "Async search can load remote data and render richer row metadata.",
                  fieldType: FormFieldType.ASYNC_SELECT,
                  loadOptions: loadTeamLeads,
                  valueKey: "id",
                  selectLabelKey: {
                    primary: { key: "name" },
                    columns: [
                      { key: "email", width: 220 },
                      { key: "phone", width: 120 },
                    ],
                  },
                  iconSearch: true,
                  addNewLabel: "Add new user",
                  onAddNew: () => toast.info("Use your create-user flow here."),
                  placeholder: "Search user...",
                  colSpan: "full",
                },
                {
                  name: "useCases",
                  label: "Primary use cases",
                  description:
                    "Multi-select keeps chip rendering and selection limits inside the shared field shell.",
                  fieldType: FormFieldType.MULTI_SELECT,
                  data: useCaseOptions,
                  labelKey: "label",
                  valueKey: "value",
                  maxSelected: 4,
                  colSpan: "full",
                },
                {
                  name: "assistantEnabled",
                  label: "Enable rollout assistant",
                  description:
                    "Switch inputs can reveal follow-up controls without local wrapper logic.",
                  fieldType: FormFieldType.SWITCH,
                  colSpan: "full",
                },
                {
                  name: "assistantName",
                  label: "Assistant name",
                  fieldType: FormFieldType.INPUT,
                  placeholder: "Nina",
                  prefix: <SparklesIcon className="size-4" />,
                  show: (values) => values.assistantEnabled,
                },
                {
                  name: "notifyTeam",
                  label: "Notify implementation team",
                  description:
                    "Boolean field composition also works for inline checkbox layouts.",
                  fieldType: FormFieldType.CHECKBOX,
                  colSpan: 2,
                },
              ],
            },
            {
              title: "Numeric and formatted inputs",
              description:
                "Number stepper, currency, percent, masked entry, slider, and OTP share one normalized field API.",
              layout: "grid-3",
              fields: [
                {
                  name: "teamSize",
                  label: "Team size",
                  fieldType: FormFieldType.NUMBER,
                  numberMin: 1,
                  numberMax: 500,
                  numberStep: 1,
                  description:
                    "Stepper controls remain fully controlled by RHF.",
                },
                {
                  name: "monthlyBudget",
                  label: "Monthly budget",
                  fieldType: FormFieldType.CURRENCY,
                  placeholder: "0.00",
                  prefix: <CreditCardIcon className="size-4" />,
                },
                {
                  name: "completionRate",
                  label: "Completion rate",
                  fieldType: FormFieldType.PERCENT,
                  placeholder: "0%",
                  suffix: <BadgeCheckIcon className="size-4" />,
                },
                {
                  name: "taxId",
                  label: "TIN",
                  fieldType: FormFieldType.MASKED,
                  placeholder: "123-456-789-000",
                  mask: "###-###-###-###",
                  prefix: <FileTextIcon className="size-4" />,
                },
                {
                  name: "migrationProgress",
                  label: "Migration progress",
                  fieldType: FormFieldType.SLIDER,
                  sliderMin: 0,
                  sliderMax: 100,
                  sliderStep: 1,
                  showSliderValue: true,
                  colSpan: 2,
                },
                {
                  name: "verificationCode",
                  label: "Verification code",
                  description:
                    "OTP supports segmented entry, paste, and keyboard flow.",
                  fieldType: FormFieldType.OTP,
                  otpLength: 6,
                  colSpan: "full",
                },
                {
                  name: "termsAccepted",
                  label: "I accept the publishing requirements",
                  description:
                    "Use this for consent, terms, policy acknowledgment, or destructive confirmation flows.",
                  fieldType: FormFieldType.CHECKBOX,
                  colSpan: "full",
                },
              ],
            },
          ]}
          buttons={{
            save: {
              label: "Save field configuration",
              submit: true,
              loadingLabel: "Saving configuration...",
              iconLeft: <BellRingIcon className="size-4" />,
              onSubmit: handleSubmit,
            },
            publish: {
              label: "Publish preview",
              submit: true,
              variant: "outline",
              iconLeft: <UsersIcon className="size-4" />,
              onSubmit: handleSubmit,
            },
          }}
          buttonLayout="inline"
        />
      </CardContent>
    </Card>
  );
}
