
SAMPLE USAGE:

```tsx
"use client";

import { Login, LoginSchema } from "@/db/types/user";
import { FormFieldType } from "@/components/forms/form-field";

// Queries and mutations
// import { useUserLogin } from "@/db/graphql/query/user-queries";
import { FormBuilderStandard } from "@/components/forms/form-ui/standard-form/form-standard-builder";
import { UserIcon } from "lucide-react";
import { showSuccess } from "@/lib/helper/toast-icon";

export default function LoginFormPage() {
  // const { mutateAsync: login } = useUserLogin();

  // const handleLogin = async (values: Login) => {
  //   const result = await login(values);
  //   console.log("Logged in:", result);
  // };

    const handleLogin = async (values: Login) => {
      const result = values
      showSuccess({ message: `Welcome back, ${values.email}!` });
      

    console.log("Logged in:", result);
  };

  return (
    <FormBuilderStandard<Login>
      schema={LoginSchema}
      formType="CREATE"
      defaultValues={{ email: "", password: "" }}
      recaptcha={true}
      sections={[
        {
          layout: "stack",
          // title: "Please enter your login credentialss",
          // description: "Please enter your login credentials ",
          fields: [
            {
              name: "email",
              label: "User Email",
              placeholder: "Enter your user email",
              fieldType: FormFieldType.INPUT,
              required: true,
              height: "lg",
            },
            {
              name: "password",
              label: "Password",
              placeholder: "Enter your user email",
              fieldType: FormFieldType.INPUT,
              required: true,
              height: "lg",
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
      }}
    />
  );
}
