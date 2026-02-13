import { ApplicationsTable } from "./applications-table";

export default function ApplicationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Workshop Applications</h1>
        <p className="text-sm text-muted-foreground">
          Review and manage workshop applications
        </p>
      </div>
      <ApplicationsTable />
    </div>
  );
}
