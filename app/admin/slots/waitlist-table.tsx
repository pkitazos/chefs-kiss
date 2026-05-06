"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Booking, waitlistEntries } from "@/lib/db/schema";
import type { SeatBreakdown } from "@/lib/db/seat-counting";
import { formatDate } from "@/lib/utils/format-date";

import { WaitlistRowActions } from "./waitlist-row-actions";

const waitlistStatusVariants = {
  waiting: "secondary",
  promoted: "default",
  cancelled: "outline",
  revoked: "outline",
} as const;

const paymentStatusConfig = {
  pending: {
    label: "Awaiting payment",
    className: "bg-amber-500/15 text-amber-400 border-amber-500/50",
  },
  confirmed: {
    label: "Paid",
    className: "bg-green-500/10 text-green-600 border-green-500/40",
  },
  failed: {
    label: "Payment failed",
    className: "bg-red-500/10 text-red-600 border-red-500/40",
  },
  expired: {
    label: "Payment expired",
    className: "bg-amber-500/15 text-amber-400 border-amber-500/50",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-500/10 text-red-600 border-red-500/40",
  },
} as const;

type WaitlistEntry = typeof waitlistEntries.$inferSelect & {
  booking: Pick<Booking, "id" | "status" | "paidAt"> | null;
};

interface WaitlistTableProps {
  entries: WaitlistEntry[];
  breakdown: SeatBreakdown;
}

export function WaitlistTable({ entries, breakdown }: WaitlistTableProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-lg border bg-muted/30 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          No waitlist entries for this slot.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Party size</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry, idx) => (
            <TableRow key={entry.id}>
              <TableCell className="font-mono text-xs">{entry.id}</TableCell>
              <TableCell>{entry.fullName}</TableCell>
              <TableCell className="text-muted-foreground">
                {entry.email}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {entry.phone}
              </TableCell>
              <TableCell>{entry.partySize}</TableCell>
              <TableCell>
                <Badge variant={waitlistStatusVariants[entry.status]}>
                  {entry.status}
                </Badge>
              </TableCell>
              <TableCell>
                {entry.status === "promoted" && entry.booking ? (
                  <div className="space-y-0.5">
                    <p className="font-mono text-xs">{entry.booking.id}</p>
                    <Badge
                      variant="outline"
                      className={
                        paymentStatusConfig[entry.booking.status].className
                      }
                    >
                      {paymentStatusConfig[entry.booking.status].label}
                    </Badge>
                  </div>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-xs">
                <span className="font-mono">#{idx + 1}</span>
                <span className="text-muted-foreground">
                  {" · "}
                  {formatDate(entry.createdAt)}
                </span>
              </TableCell>
              <TableCell>
                <WaitlistRowActions
                  entryId={entry.id}
                  email={entry.email}
                  fullName={entry.fullName}
                  partySize={entry.partySize}
                  breakdown={breakdown}
                  status={entry.status}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
