import { ApplicationsTable } from "./applications-table";

export default function ApplicationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Vendor Applications</h1>
        <p className="text-muted-foreground">
          Review and manage vendor applications
        </p>
      </div>
      <ApplicationsTable />
    </div>
  );
}
