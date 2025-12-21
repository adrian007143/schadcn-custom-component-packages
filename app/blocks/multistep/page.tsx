import CreateOrgForm from "@/components/examples/form-ui-multistep-template";

export default function MultiStepFormPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-5xl flex-col gap-6 border rounded-md p-10 shadow-2xl">
        <h4 className="font-extrabold text-2xl">Create Organization</h4>
        <CreateOrgForm />
      </div>
    </div>
  );
}
