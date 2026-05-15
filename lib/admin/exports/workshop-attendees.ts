import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { bookings, waitlistEntries } from "@/lib/db/schema";
import { getWorkshopBySlug } from "@/lib/config/workshops";

export type AttendeeRow = {
  bookingId: string;
  slotDate: string;
  slotTime: string;
  customerName: string;
  email: string;
  phone: string;
  seats: number;
  type: "Booking" | "Waitlist";
};

type IntermediateRow = AttendeeRow & { _sortDate: number };

export async function getWorkshopAttendees(
  slug: string,
  includeWaitlist: boolean,
): Promise<AttendeeRow[] | null> {
  const workshop = getWorkshopBySlug(slug);
  if (!workshop) return null;

  const slotMap = new Map<string, { date: Date; time: string }>();
  for (const day of workshop.days) {
    for (const slot of day.slots) {
      slotMap.set(slot.id, { date: day.date, time: slot.time });
    }
  }

  const slotIds = [...slotMap.keys()];

  const confirmedBookings = await db
    .select({
      id: bookings.id,
      slotId: bookings.slotId,
      fullName: bookings.fullName,
      email: bookings.email,
      phone: bookings.phone,
      seats: bookings.seats,
    })
    .from(bookings)
    .where(
      and(inArray(bookings.slotId, slotIds), eq(bookings.status, "confirmed")),
    );

  const rows: IntermediateRow[] = confirmedBookings.map((b) => {
    const slot = slotMap.get(b.slotId)!;
    return {
      _sortDate: slot.date.getTime(),
      bookingId: b.id,
      slotDate: formatDate(slot.date),
      slotTime: extractStartTime(slot.time),
      customerName: b.fullName,
      email: b.email,
      phone: b.phone,
      seats: b.seats,
      type: "Booking",
    };
  });

  if (includeWaitlist) {
    const waitlistRows = await db
      .select({
        id: waitlistEntries.id,
        slotId: waitlistEntries.slotId,
        fullName: waitlistEntries.fullName,
        email: waitlistEntries.email,
        phone: waitlistEntries.phone,
        partySize: waitlistEntries.partySize,
      })
      .from(waitlistEntries)
      .where(
        and(
          inArray(waitlistEntries.slotId, slotIds),
          inArray(waitlistEntries.status, ["waiting", "promoted"]),
        ),
      );

    for (const w of waitlistRows) {
      const slot = slotMap.get(w.slotId)!;
      rows.push({
        _sortDate: slot.date.getTime(),
        bookingId: w.id,
        slotDate: formatDate(slot.date),
        slotTime: extractStartTime(slot.time),
        customerName: w.fullName,
        email: w.email,
        phone: w.phone,
        seats: w.partySize,
        type: "Waitlist",
      });
    }
  }

  rows.sort(
    (a, b) =>
      a._sortDate - b._sortDate ||
      a.slotTime.localeCompare(b.slotTime) ||
      a.customerName.localeCompare(b.customerName),
  );

  return rows.map(({ _sortDate: _, ...row }) => row);
}

function formatDate(date: Date): string {
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

function extractStartTime(timeRange: string): string {
  return timeRange.split(" - ")[0];
}
