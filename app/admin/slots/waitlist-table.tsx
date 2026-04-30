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
import { waitlistEntries } from "@/lib/db/schema";

import { WaitlistRowActions } from "./waitlist-row-actions";

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

type WaitlistEntry = typeof waitlistEntries.$inferSelect;

interface WaitlistTableProps {
  entries: WaitlistEntry[];
  available: number;
}

export function WaitlistTable({ entries, available }: WaitlistTableProps) {
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
                  available={available}
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
