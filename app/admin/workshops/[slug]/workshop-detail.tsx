"use client";

import { useState } from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { eventDateFormat } from "@/lib/config/event";
import { buildSeatBreakdown } from "@/lib/db/seat-counting";
import { api } from "@/lib/trpc/client";

import {
  IconArrowLeft,
  IconChevronRight,
  IconDownload,
  IconLoader2,
} from "@tabler/icons-react";
import { CapacityInfoIcon } from "../../slots/capacity-info";

import { WaitlistTable } from "../../slots/waitlist-table";

interface SlotInfo {
  slotId: string;
  date: string;
  time: string;
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
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            This view focuses on the waitlist queues across this workshop&apos;s
            slots. For the full bookings roster of a specific session, open the
            per-slot detail page.
          </p>
          <p className="text-xs text-muted-foreground">
            Slug: <span className="font-mono">{slug}</span>
          </p>
          <ExportCsvControl slug={slug} />
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

function ExportCsvControl({ slug }: { slug: string }) {
  const [includeWaitlist, setIncludeWaitlist] = useState(false);
  const href = includeWaitlist
    ? `/admin/workshops/${slug}/csv?includeWaitlist=true`
    : `/admin/workshops/${slug}/csv`;

  return (
    <div className="flex items-center gap-3">
      <Button asChild variant="outline" size="sm">
        <a href={href}>
          <IconDownload className="size-3.5" />
          Export CSV
        </a>
      </Button>
      <div className="flex items-center gap-2">
        <Checkbox
          id="include-waitlist"
          checked={includeWaitlist}
          onCheckedChange={(v) => setIncludeWaitlist(v === true)}
        />
        <Label
          htmlFor="include-waitlist"
          className="text-xs text-muted-foreground cursor-pointer"
        >
          Include waitlist
        </Label>
      </div>
    </div>
  );
}

function SlotSection({ slot }: { slot: SlotInfo }) {
  const { data, isLoading, error } = api.slots.bySlot.useQuery({
    slotId: slot.slotId,
  });

  const breakdown = buildSeatBreakdown(
    slot.capacity,
    data?.counts ?? { booked: 0, reserved: 0, held: 0 },
  );
  const filled = breakdown.booked + breakdown.reserved + breakdown.held;

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
                {filled} / {slot.capacity} ({breakdown.booked}b ·{" "}
                {breakdown.reserved}r · {breakdown.held}h)
                <CapacityInfoIcon />
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
      <CardContent className="space-y-3">
        <h3 className="text-sm font-semibold">Waitlist queue</h3>
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <IconLoader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">
            Failed to load: {error.message}
          </p>
        ) : data ? (
          <WaitlistTable entries={data.waitlist} breakdown={breakdown} />
        ) : null}
      </CardContent>
    </Card>
  );
}
