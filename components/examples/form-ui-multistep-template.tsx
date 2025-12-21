"use client";

import { Organization, OrganizationSchema } from "./schema";
import { showSuccess } from "@/lib/helper/toast-icon";
import { UseFormReturn } from "react-hook-form";
import {
  Building2,
  Globe,
  Mail,
  MapPin,
  Banknote,
  FileText,
  Hash,
} from "lucide-react"; // ✅ Icons
import { MultiStepForm } from "@/components/forms/form-ui/multistep-form/MultiStepForm";
import { FormFieldType } from "../forms/form-field";
import { FormLayout } from "../forms/form-layout/FormLayout";

const defaultValues: Organization = {
  name: "",
  legal_name: "",
  country: "PHILIPPINES",
  base_currency: "PHP",
  email: "",
  website: "",
  org_type: "partnership",
  industry: "accounting",
  tax_id: "",
  address1: "",
  address2: "",
  city: "Quezon City",
  zip_code: "",
  phone: "",
  primary_activity: "",
  capital: 0,
};

export default function CreateOrgForm() {
  const handleSubmit = async (
    values: Organization,
    form: UseFormReturn<Organization>
  ) => {
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));

    console.log("Submitted:", values);

    showSuccess({
      message: "Organization created successfully",
      description: "You can now access your organization dashboard.",
    });

    form.reset();
  };

  const inputheight = "xl";

  return (
    <FormLayout>
      <MultiStepForm<Organization>
        schema={OrganizationSchema}
        layoutMode="vertical"
        variant="ghost"
        mode="CREATE"
        defaultValues={defaultValues}
        FormLayout="grid-2"
        FormColumns={2}
        onSubmit={handleSubmit}
        steps={[
          {
            layout: "grid-2",
            title: "Organization Details",
            description: "Basic information about the entity.",
            fields: [
              {
                name: "name",
                label: "Organization Name",
                placeholder: "Acme Corp",
                fieldType: FormFieldType.INPUT,
                required: true,
                height: inputheight,
                icon: <Building2 className="size-4" />,
              },
              {
                name: "legal_name",
                label: "Legal Entity Name",
                placeholder: "Acme Corporation Inc.",
                fieldType: FormFieldType.INPUT,
                required: true,
                height: inputheight,
                icon: <FileText className="size-4" />,
              },
              {
                name: "country",
                label: "Country",
                fieldType: FormFieldType.ASYNC_SELECT,
                data: [
                  { label: "Philippines", value: "PH" },
                  { label: "United States", value: "US" },
                  { label: "Germany", value: "DE" },
                ],
                selectLabelKey: {
                  primary: { key: "label" },
                  columns: [{ key: "value" }],
                },
                valueKey: "value",
                required: true,
                height: inputheight,
                icon: <Globe className="size-4" />,
              },
              {
                name: "base_currency",
                label: "Base Currency",
                fieldType: FormFieldType.SELECT,
                data: [
                  { label: "PHP", value: "PHP" },
                  { label: "USD", value: "USD" },
                  { label: "EUR", value: "EUR" },
                ],
                selectLabelKey: {
                  primary: { key: "label" },
                  columns: [{ key: "value" }],
                },
                required: true,
                height: inputheight,
                icon: <Banknote className="size-4" />,
              },
              {
                name: "email",
                label: "Contact Email",
                fieldType: FormFieldType.INPUT,
                type: "email",
                required: true,
                height: inputheight,
                icon: <Mail className="size-4" />,
              },
              {
                name: "website",
                label: "Website",
                placeholder: "https://",
                fieldType: FormFieldType.INPUT,
                height: inputheight,
                icon: <Globe className="size-4" />,
              },
              {
                name: "capital",
                label: "Capital",
                placeholder: "0.00",
                fieldType: FormFieldType.CURRENCY,
                height: inputheight,
                icon: "₱",
              },
            ],
          },

          {
            layout: "grid-2",
            title: "Classification",
            description: "Industry and tax details.",
            fields: [
              {
                name: "org_type",
                label: "Organization Type",
                placeholder: "e.g. Partnership, LLC",
                fieldType: FormFieldType.ASYNC_SELECT,
                data: [
                  { label: "Partnership", value: "partnership" },
                  { label: "LLC", value: "llc" },
                  {
                    label: "Sole Proprietorship",
                    value: "sole-proprietorship",
                  },
                ],
                selectLabelKey: {
                  primary: { key: "label" },
                  columns: [{ key: "value" }],
                },
                labelKey: "label",
                valueKey: "value",
                required: true,
                height: inputheight,
              },
              {
                name: "industry",
                label: "Industry",
                fieldType: FormFieldType.INPUT,
                height: inputheight,
              },
              {
                name: "tax_id",
                label: "Tax ID (TIN)",
                mask: "###-###-###-###",
                maskPlaceholder: "123-456-789-000",
                placeholder: "000-000-000",
                fieldType: FormFieldType.MASKED,
                height: inputheight,
                icon: <Hash className="size-4" />,
              },
              {
                name: "primary_activity",
                label: "Primary Activity",
                fieldType: FormFieldType.INPUT,
                height: inputheight,
              },
            ],
          },

          {
            layout: "grid-2",
            title: "Billing Address",
            description: "Official registered address.",
            fields: [
              {
                name: "address1",
                label: "Address Line 1",
                fieldType: FormFieldType.INPUT,
                required: true,
                height: inputheight,
                icon: <MapPin className="size-4" />,
              },
              {
                name: "address2",
                label: "Address Line 2",
                fieldType: FormFieldType.INPUT,
                height: inputheight,
                icon: <MapPin className="size-4" />,
              },
              {
                name: "city",
                label: "City",
                fieldType: FormFieldType.INPUT,
                required: true,
                height: inputheight,
              },
              {
                name: "zip_code",
                label: "Zip Code",
                fieldType: FormFieldType.INPUT,
                height: inputheight,
              },
              {
                name: "phone",
                label: "Phone Number",
                fieldType: FormFieldType.PHONE_INPUT, // Assuming you have this set up
                height: inputheight,
              },
            ],
          },
        ]}
      />
    </FormLayout>
  );
}
