"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconLoader2 } from "@tabler/icons-react";
import Link from "next/link";
import { format } from "date-fns";
import { api } from "@/lib/trpc/client";
import { getDiningSessionById } from "@/lib/config/private-dining";
import { getWorkshopSlotById } from "@/lib/config/workshops";
import { PaymentBadge } from "./payment-badge";

function getSlotLabel(
  type: "private-dining" | "workshop",
  slotId: string,
): { title: string; subtitle: string } | null {
  if (type === "private-dining") {
    const found = getDiningSessionById(slotId);
    if (!found) return null;
    return {
      title: found.session.title,
      subtitle: `${format(found.day.date, "EEE d MMM")} · ${found.session.time}`,
    };
  }
  const found = getWorkshopSlotById(slotId);
  if (!found) return null;
  return {
    title: found.workshop.title,
    subtitle: `${format(found.day.date, "EEE d MMM")} · ${found.slot.time}`,
  };
}

const statusVariants = {
  pending: "secondary",
  confirmed: "default",
  failed: "destructive",
  expired: "outline",
  cancelled: "outline",
} as const;

const typeLabels = {
  "private-dining": "Private Dining",
  workshop: "Workshop",
} as const;

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function BookingsTable() {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const {
    data: bookings,
    isLoading,
    error,
  } = api.bookings.adminList.useQuery({
    type:
      typeFilter === "all"
        ? undefined
        : (typeFilter as "private-dining" | "workshop"),

    status:
      statusFilter === "all"
        ? undefined
        : // TODO: include "cancelled" once it's added to the SelectItem list below.
          (statusFilter as "pending" | "confirmed" | "failed" | "expired"),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <IconLoader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">
          Failed to load bookings: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="private-dining">Private Dining</SelectItem>
            <SelectItem value="workshop">Workshop</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            {/* TODO: add a "cancelled" option once admin cancellation lands. */}
          </SelectContent>
        </Select>
      </div>

      {bookings && bookings.length > 0 ? (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Seats</TableHead>
                <TableHead>Slot</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => {
                const slotLabel = getSlotLabel(booking.type, booking.slotId);
                return (
                  <TableRow key={booking.id}>
                    <TableCell className="font-mono text-xs">
                      {booking.id}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {typeLabels[booking.type]}
                      </Badge>
                    </TableCell>
                    <TableCell>{booking.fullName}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {booking.email}
                    </TableCell>
                    <TableCell>{booking.seats}</TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/slots/${booking.slotId}`}
                        className="hover:underline"
                      >
                        {slotLabel ? (
                          <div>
                            <div className="text-sm font-medium">
                              {slotLabel.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {slotLabel.subtitle}
                            </div>
                          </div>
                        ) : (
                          <span className="font-mono text-xs">
                            {booking.slotId}
                          </span>
                        )}
                      </Link>
                    </TableCell>
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
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-muted-foreground text-sm">No bookings found.</p>
        </div>
      )}
    </div>
  );
}
