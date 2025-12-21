"use client";

import { FormFieldType } from "@/components/forms/form-field";
import { FormBuilderStandard } from "@/components/forms/form-ui/standard-form/form-standard-builder";
import { CircleUserRound, UserIcon } from "lucide-react";
import { showSuccess } from "@/lib/helper/toast-icon";
import z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

// Login schema
const LoginSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .trim()
    .toLowerCase()
    .min(3, { message: "Email must be at least 3 characters long." }),

  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters long." })
    .max(50, { message: "Password must not exceed 128 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[@$!%*?&]/, {
      message:
        "Password must contain at least one special character (@$!%*?&).",
    }),
});

type Login = z.infer<typeof LoginSchema>;

export default function LoginFormPage() {
  // Handle form submission logic
  const handleLogin = async (values: Login) => {
    const result = values;
    showSuccess({ message: `Welcome back, ${values.email}!` });

    console.log("Logged in:", result);
  };

  return (
    <Card>
      <CardHeader className="flex flex-col items-center justify-center text-center">
        <div className="flex rounded-full bg-primary/10 ">
          <CircleUserRound className="h-8 w-8 text-primary" />
        </div>
        <CardTitle> Login</CardTitle>
        <CardDescription>Please enter your login credentials</CardDescription>
      </CardHeader>
      <CardContent>
        <FormBuilderStandard<Login>
          schema={LoginSchema}
          formType="CREATE"
          defaultValues={{ email: "testing@example.com", password: "testingQQW!1" }}
          recaptcha={true}
          sections={[
            {
              layout: "stack",
              // OPTIONAL TITLE & DESCRIPTION
              // title: "Please enter your login credentialss",
              // description: "Please enter your login credentials ",
              fields: [
                {
                  name: "email",
                  label: "User Email",
                  placeholder: "Enter your user email",
                  fieldType: FormFieldType.INPUT,
                  required: true,
                  height: "md",
                },
                {
                  name: "password",
                  label: "Password",
                  placeholder: "Enter your user email",
                  fieldType: FormFieldType.PASSWORD,
                  required: true,
                  height: "md",
                },
              ],
            },
          ]}
          buttonLayout="stack"
          buttons={{
            login: {
              label: "Login",
              variant: "default",
              submit: true,
              onSubmit: handleLogin,
              loadingLabel: "Logging in...",
              iconLeft: <UserIcon className="w-4 h-4" />,
            },
            save: {
              label: "Login",
              variant: "default",
              submit: true,
              onSubmit: handleLogin,
              loadingLabel: "Logging in...",
              iconLeft: <UserIcon className="w-4 h-4" />,
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
