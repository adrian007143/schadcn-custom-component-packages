"use client";

import { MailIcon, LockIcon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { FormFieldType } from "@/components/forms/core";
import { SchemaForm } from "@/components/forms/patterns/SchemaForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const loginFormSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginFormTemplate() {
  const onSubmit = async (values: LoginFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 900));
    toast.success(`Signed in as ${values.email}.`);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          A starter login template built with `SchemaForm` on top of the shared
          field system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SchemaForm<LoginFormValues>
          schema={loginFormSchema}
          defaultValues={{
            email: "adrian@example.com",
            password: "supersecret",
            rememberMe: true,
          }}
          sections={[
            {
              fields: [
                {
                  name: "email",
                  fieldType: FormFieldType.INPUT,
                  type: "email",
                  label: "Email",
                  placeholder: "you@example.com",
                  prefix: <MailIcon className="size-4" />,
                  required: true,
                },
                {
                  name: "password",
                  fieldType: FormFieldType.PASSWORD,
                  label: "Password",
                  placeholder: "Enter your password",
                  prefix: <LockIcon className="size-4" />,
                  required: true,
                },
                {
                  name: "rememberMe",
                  fieldType: FormFieldType.CHECKBOX,
                  label: "Remember me",
                  description: "Keeps the session active on this device.",
                },
              ],
            },
          ]}
          buttons={{
            signIn: {
              label: "Sign in",
              submit: true,
              loadingLabel: "Signing in...",
              onSubmit,
              className: "w-full",
            },
          }}
        />
      </CardContent>
      <CardFooter className="justify-center border-t pt-6 text-sm text-muted-foreground">
        Need an account? Contact your workspace administrator.
      </CardFooter>
    </Card>
  );
}
