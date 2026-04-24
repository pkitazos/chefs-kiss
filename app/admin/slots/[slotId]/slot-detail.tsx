"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { eventDateFormat } from "@/lib/config/event";
import { api } from "@/lib/trpc/client";
import { IconArrowLeft, IconLoader2, IconMapPin } from "@tabler/icons-react";

import { PaymentBadge } from "../../bookings/payment-badge";
import { BookingRowActions } from "../booking-row-actions";
import { WaitlistRowActions } from "../waitlist-row-actions";

const statusVariants = {
  pending: "secondary",
  confirmed: "default",
  failed: "destructive",
  expired: "outline",
} as const;

const waitlistStatusVariants = {
  waiting: "secondary",
  promoted: "default",
  cancelled: "outline",
} as const;

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

interface SlotDetailProps {
  slotId: string;
  type: "private-dining" | "workshop";
  title: string;
  workshopSlug?: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  price: number;
}

export function SlotDetail({
  slotId,
  type,
  title,
  workshopSlug,
  date,
  time,
  location,
  capacity,
  price,
}: SlotDetailProps) {
  const { data, isLoading, error } = api.slots.bySlot.useQuery({ slotId });

  const parsedDate = new Date(date);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/slots"
          className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          <IconArrowLeft className="size-4" />
          All slots
        </Link>
        {workshopSlug && (
          <>
            <span className="text-muted-foreground">·</span>
            <Link
              href={`/admin/workshops/${workshopSlug}`}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Workshop rollup
            </Link>
          </>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <Badge variant="outline" className="mb-2">
                {type === "private-dining" ? "Private Dining" : "Workshop"}
              </Badge>
              <CardTitle className="mt-2 text-2xl">{title}</CardTitle>
              <CardDescription className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                <span>
                  {eventDateFormat.dayName(parsedDate)} at {time}
                </span>
                <span className="inline-flex items-center gap-1">
                  <IconMapPin className="size-3.5" /> {location}
                </span>
                <span className="font-mono text-xs">{slotId}</span>
              </CardDescription>
            </div>
            <CapacityMeter
              capacity={capacity}
              booked={data?.bookedSeats ?? 0}
              price={price}
            />
          </div>
        </CardHeader>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <IconLoader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            Failed to load slot: {error.message}
          </p>
        </div>
      ) : data ? (
        <>
          <section className="space-y-3">
            <div className="flex items-baseline justify-between">
              <h2 className="text-lg font-semibold">Bookings</h2>
              <p className="text-xs text-muted-foreground">
                {data.bookings.length} total · {data.bookedSeats} seats in
                confirmed/pending
              </p>
            </div>
            {data.bookings.length > 0 ? (
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Seats</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-12" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-mono text-xs">
                          {booking.id}
                        </TableCell>
                        <TableCell>{booking.fullName}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {booking.email}
                        </TableCell>
                        <TableCell>{booking.seats}</TableCell>
                        <TableCell>
                          <Badge variant={statusVariants[booking.status]}>
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <PaymentBadge
                            paymentMethod={booking.paymentMethod}
                            paidAt={booking.paidAt}
                          />
                        </TableCell>
                        <TableCell>
                          &euro;{(booking.totalAmount / 100).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {formatDate(booking.createdAt)}
                        </TableCell>
                        <TableCell>
                          <BookingRowActions
                            bookingId={booking.id}
                            email={booking.email}
                            fullName={booking.fullName}
                            paymentMethod={booking.paymentMethod}
                            paidAt={booking.paidAt}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="rounded-lg border bg-muted/30 p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  No bookings for this slot yet.
                </p>
              </div>
            )}
          </section>

          <section className="space-y-3">
            <div className="flex items-baseline justify-between">
              <h2 className="text-lg font-semibold">Waitlist queue</h2>
              <p className="text-xs text-muted-foreground">
                {data.waitlistCount} waiting · FIFO ordered (oldest first)
              </p>
            </div>
            {data.waitlist.length > 0 ? (
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Position</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Party size</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-12" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.waitlist.map((entry, idx) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-mono text-xs">
                          #{idx + 1}
                        </TableCell>
                        <TableCell>{entry.fullName}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {entry.email}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {entry.phone}
                        </TableCell>
                        <TableCell>{entry.partySize}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {formatDate(entry.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={waitlistStatusVariants[entry.status]}>
                            {entry.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <WaitlistRowActions
                            entryId={entry.id}
                            email={entry.email}
                            fullName={entry.fullName}
                            partySize={entry.partySize}
                            capacity={capacity}
                            bookedSeats={data.bookedSeats}
                            status={entry.status}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="rounded-lg border bg-muted/30 p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  No waitlist entries for this slot.
                </p>
              </div>
            )}
          </section>
        </>
      ) : null}
    </div>
  );
}

function CapacityMeter({
  capacity,
  booked,
  price,
}: {
  capacity: number;
  booked: number;
  price: number;
}) {
  const over = booked > capacity;
  return (
    <div className="text-right">
      <div
        className={`text-2xl font-bold ${over ? "text-amber-700" : "text-foreground"}`}
      >
        {booked} <span className="text-muted-foreground">/ {capacity}</span>
      </div>
      <div className="text-xs text-muted-foreground">seats · €{price}/seat</div>
    </div>
  );
}
