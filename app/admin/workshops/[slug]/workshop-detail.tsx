"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import {
  IconArrowLeft,
  IconChevronRight,
  IconLoader2,
  IconMapPin,
} from "@tabler/icons-react";

import { WaitlistRowActions } from "../../slots/waitlist-row-actions";

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

interface SlotInfo {
  slotId: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
}

interface WorkshopDetailProps {
  slug: string;
  title: string;
  hostedBy: string;
  tagline: string;
  slots: SlotInfo[];
}

export function WorkshopDetail({
  slug,
  title,
  hostedBy,
  tagline,
  slots,
}: WorkshopDetailProps) {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/slots"
          className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          <IconArrowLeft className="size-4" />
          All slots
        </Link>
      </div>

      <Card>
        <CardHeader>
          <Badge variant="outline" className="mb-2 w-fit">
            Workshop
          </Badge>
          <CardTitle className="mt-2 text-2xl">{title}</CardTitle>
          <CardDescription>
            Hosted by {hostedBy} · {tagline}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            This view focuses on the waitlist queues across this workshop&apos;s
            slots. For the full bookings roster of a specific session, open the
            per-slot detail page.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Slug: <span className="font-mono">{slug}</span>
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {slots.map((slot) => (
          <SlotSection key={slot.slotId} slot={slot} />
        ))}
      </div>
    </div>
  );
}

function SlotSection({ slot }: { slot: SlotInfo }) {
  const { data, isLoading, error } = api.slots.bySlot.useQuery({
    slotId: slot.slotId,
  });

  const parsedDate = new Date(slot.date);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">
              {eventDateFormat.dayName(parsedDate)} at {slot.time}
            </CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <IconMapPin className="size-3.5" />
                {slot.location}
              </span>
              <span>
                {data?.bookedSeats ?? 0} / {slot.capacity} booked
              </span>
              <span className="font-mono text-xs">{slot.slotId}</span>
            </CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={`/admin/slots/${slot.slotId}`}>
              Slot details
              <IconChevronRight className="size-3" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <IconLoader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">
            Failed to load: {error.message}
          </p>
        ) : data && data.waitlist.length > 0 ? (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
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
                        capacity={slot.capacity}
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
          <p className="text-sm text-muted-foreground">
            No waitlist entries for this slot.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
