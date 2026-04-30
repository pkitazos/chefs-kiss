import { BookingsTable } from "./bookings-table";

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">All Bookings</h1>
        <p className="text-sm text-muted-foreground">
          Every private dining and workshop booking. Click a slot to view the
          full session.
        </p>
      </div>
      <BookingsTable />
    </div>
  );
}
