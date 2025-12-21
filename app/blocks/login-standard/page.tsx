import LoginFormPage from "@/components/examples/form-ui-standard-template";

export default function LoginPage() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <LoginFormPage />
      </div>
    </div>
  );
}
