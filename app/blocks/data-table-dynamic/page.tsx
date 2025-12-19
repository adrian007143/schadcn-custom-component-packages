import DataTableDynamic from "@/components/examples/data-table-dynamic";


export default function UserPage() {
  return (
    <main className="">
      {/* Page Header */}
      <header className="flex items-center justify-between py-1">
        <div className="flex items-center space-x-2 p-1">
          <h4> 👥 </h4>
                
          <p className=" text-sm text-muted-foreground">
            Manage all registered users in the system.
          </p>
        </div>
      </header>

      {/* Table */}
      <section className="rounded-lg border bg-card shadow-sm px-4">
        <DataTableDynamic/>
      </section>
    </main>
  );
}
