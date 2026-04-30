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
import { buildSeatBreakdown, type SeatBreakdown } from "@/lib/db/seat-counting";
import { api } from "@/lib/trpc/client";
import { IconArrowLeft, IconLoader2 } from "@tabler/icons-react";

import { PaymentBadge } from "../../bookings/payment-badge";
import { BookingRowActions } from "../booking-row-actions";
import { CapacityInfoIcon } from "../capacity-info";
import { WaitlistTable } from "../waitlist-table";

const statusVariants = {
  pending: "secondary",
  confirmed: "default",
  failed: "destructive",
  expired: "outline",
  cancelled: "outline",
} as const;

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

type SlotDetailProps = {
  slotId: string;
  title: string;
  date: string;
  time: string;
  capacity: number;
  price: number;
} & ({ type: "private-dining" } | { type: "workshop"; workshopSlug: string });

export function SlotDetail(props: SlotDetailProps) {
  const { slotId, type, title, date, time, capacity, price } = props;
  const { data, isLoading, error } = api.slots.bySlot.useQuery({ slotId });

  const breakdown: SeatBreakdown = buildSeatBreakdown(
    capacity,
    data?.counts ?? { booked: 0, reserved: 0, held: 0 },
  );

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
        {props.type === "workshop" && (
          <>
            <span className="text-muted-foreground">·</span>
            <Link
              href={`/admin/workshops/${props.workshopSlug}`}
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
                <span className="font-mono text-xs">{slotId}</span>
              </CardDescription>
            </div>
            <CapacityMeter breakdown={breakdown} price={price} />
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
                {data.bookings.length} total · {breakdown.booked} confirmed +{" "}
                {breakdown.reserved} pending against {capacity} capacity
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
                {data.waitlistCount} waiting
              </p>
            </div>
            <WaitlistTable
              entries={data.waitlist}
              available={breakdown.available}
            />
          </section>
        </>
      ) : null}
    </div>
  );
}

function CapacityMeter({
  breakdown,
  price,
}: {
  breakdown: SeatBreakdown;
  price: number;
}) {
  const filled = breakdown.booked + breakdown.reserved + breakdown.held;
  const over = filled > breakdown.capacity;
  return (
    <div className="text-right">
      <div
        className={`text-2xl font-bold ${over ? "text-amber-700" : "text-foreground"}`}
      >
        <span className="inline-flex items-baseline gap-1">
          {filled}{" "}
          <span className="text-muted-foreground">/ {breakdown.capacity}</span>
          <CapacityInfoIcon />
        </span>
      </div>
      <div className="text-xs text-muted-foreground">
        {breakdown.booked} booked · {breakdown.reserved} reserved ·{" "}
        {breakdown.held} held
      </div>
      <div className="text-xs text-muted-foreground">€{price}/seat</div>
    </div>
  );
}
