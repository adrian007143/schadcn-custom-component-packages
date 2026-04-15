"use client";

import { UseFormReturn } from "react-hook-form";
import {
  Banknote,
  Building2,
  FileText,
  Globe,
  Hash,
  Mail,
  MapPin,
} from "lucide-react";

import { StepForm } from "@/components/forms/patterns/StepForm";
import { FormFieldType } from "@/components/forms/core";
import { FormLayout } from "@/components/forms/layout/FormLayout";
import { showSuccess } from "@/lib/helper/toast-icon";

import { Organization, OrganizationSchema } from "./schema";

const defaultValues: Organization = {
  name: "ABC COMPANY",
  legal_name: "ABC COMPANY",
  country: "Philippines",
  base_currency: "PHP",
  email: "testing@gmail.com",
  website: "wwww.abccompany.com",
  capital: 1000000,
  org_type: "partnership",
  industry: "accounting",
  tax_id: "123-456-789-000",
  primary_activity: "Accounting",
  address1: "Street 123",
  address2: "Apt 123",
  city: "Quezon City",
  zip_code: "1100",
  phone: "",
};

export default function CreateOrgForm() {
  const handleSubmit = async (
    values: Organization,
    form: UseFormReturn<Organization>
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Submitted:", values);
    showSuccess({
      message: "Organization created successfully",
      description: "You can now access your organization dashboard.",
    });
    form.reset();
  };

  const inputHeight = "md";

  return (
    <FormLayout>
      <StepForm<Organization>
        schema={OrganizationSchema}
        layoutMode="auto"
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
                height: inputHeight,
                prefix: <Building2 className="size-4" />,
              },
              {
                name: "legal_name",
                label: "Legal Entity Name",
                placeholder: "Acme Corporation Inc.",
                fieldType: FormFieldType.INPUT,
                required: true,
                height: inputHeight,
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
                labelKey: "label",
                valueKey: "value",
                required: true,
                height: inputHeight,
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
                labelKey: "label",
                valueKey: "value",
                required: true,
                height: inputHeight,
                icon: <Banknote className="size-4" />,
              },
              {
                name: "email",
                label: "Contact Email",
                placeholder: "yourname@example.com",
                fieldType: FormFieldType.INPUT,
                type: "email",
                required: true,
                height: inputHeight,
                icon: <Mail className="size-4" />,
              },
              {
                name: "website",
                label: "Website",
                placeholder: "https://",
                fieldType: FormFieldType.INPUT,
                height: inputHeight,
                icon: <Globe className="size-4" />,
              },
              {
                name: "capital",
                label: "Capital",
                placeholder: "0.00",
                fieldType: FormFieldType.CURRENCY,
                height: inputHeight,
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
                height: inputHeight,
              },
              {
                name: "industry",
                label: "Industry",
                fieldType: FormFieldType.INPUT,
                height: inputHeight,
              },
              {
                name: "tax_id",
                label: "Tax ID (TIN)",
                mask: "###-###-###-###",
                maskPlaceholder: "123-456-789-000",
                placeholder: "000-000-000",
                fieldType: FormFieldType.MASKED,
                height: inputHeight,
                icon: <Hash className="size-4" />,
              },
              {
                name: "primary_activity",
                label: "Primary Activity",
                fieldType: FormFieldType.INPUT,
                height: inputHeight,
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
                height: inputHeight,
                icon: <MapPin className="size-4" />,
              },
              {
                name: "address2",
                label: "Address Line 2",
                fieldType: FormFieldType.INPUT,
                height: inputHeight,
                icon: <MapPin className="size-4" />,
              },
              {
                name: "city",
                label: "City",
                fieldType: FormFieldType.INPUT,
                required: true,
                height: inputHeight,
              },
              {
                name: "zip_code",
                label: "Zip Code",
                fieldType: FormFieldType.INPUT,
                height: inputHeight,
              },
              {
                name: "phone",
                label: "Phone Number",
                fieldType: FormFieldType.PHONE_INPUT,
                height: inputHeight,
              },
            ],
          },
        ]}
      />
    </FormLayout>
  );
}
