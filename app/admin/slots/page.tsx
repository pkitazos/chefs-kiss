import { SlotsIndexTable } from "./slots-index-table";

export default function SlotsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Slots & Waitlist</h1>
        <p className="text-sm text-muted-foreground">
          All workshop and private dining slots, with booking and waitlist
          counts.
        </p>
      </div>
      <SlotsIndexTable />
    </div>
  );
}
