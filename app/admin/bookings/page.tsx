import { BookingsTable } from "./bookings-table";

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bookings</h1>
        <p className="text-sm text-muted-foreground">
          View and manage private dining and workshop bookings
        </p>
      </div>
      <BookingsTable />
    </div>
  );
}
