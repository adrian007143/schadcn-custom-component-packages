import { z } from "zod";

// Organization Schema
export const OrganizationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  legal_name: z
    .string()
    .min(3, { message: "Description must be at least 3 characters." }),
  country: z
    .string()
    .min(3, { message: "Country must be at least 3 characters." }),
  base_currency: z
    .string()
    .min(3, { message: "Base Currency must be at least 3 characters." }),
  capital: z
    .number()
    .min(3, { message: "Capital must be at least 3 characters." }),
  email: z.email({ message: "Please enter a valid email" }).optional(),
  website: z.string().optional(),
  org_type: z
    .string()
    .min(3, { message: "org_type must be at least 3 characters." }),
  industry: z
    .string()
    .min(3, { message: "industry must be at least 3 characters." }),
  tax_id: z
    .string()
    .min(3, { message: "tax_id must be at least 3 characters." }),
  address1: z
    .string()
    .min(3, { message: "Address must be at least 3 characters." }),
  address2: z.string().optional(),
  city: z.string().min(3, { message: "City must be at least 3 characters." }),
  zip_code: z
    .string()
    .min(3, { message: "Zip Code must be at least 3 characters." }),
  phone: z.string().optional(),
  primary_activity: z
    .string()
    .min(3, { message: "description must be at least 3 characters." }),
});

export type Organization = z.infer<typeof OrganizationSchema>;
