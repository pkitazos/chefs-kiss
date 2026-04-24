"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { eventDateFormat } from "@/lib/config/event";
import { DINING_DAYS } from "@/lib/config/private-dining";
import { WORKSHOPS } from "@/lib/config/workshops";
import { api } from "@/lib/trpc/client";
import { IconChevronRight, IconLoader2 } from "@tabler/icons-react";

type SummaryRow = {
  slotId: string;
  type: "private-dining" | "workshop";
  booked: number;
  waitlist: number;
};

type SummaryMap = Map<string, SummaryRow>;

type DiningRow = {
  slotId: string;
  title: string;
  date: Date;
  time: string;
  capacity: number;
  booked: number;
  waitlist: number;
};

type WorkshopRow = {
  slotId: string;
  date: Date;
  time: string;
  capacity: number;
  booked: number;
  waitlist: number;
};

type WorkshopBlock = {
  slug: string;
  title: string;
  hostedBy: string;
  rows: WorkshopRow[];
  totalBooked: number;
  totalCapacity: number;
  totalWaitlist: number;
};

function buildRows(summary: SummaryMap) {
  const diningRows: DiningRow[] = [];
  for (const day of DINING_DAYS) {
    for (const session of day.sessions) {
      const s = summary.get(session.id);
      diningRows.push({
        slotId: session.id,
        title: session.title,
        date: day.date,
        time: session.time,
        capacity: session.capacity,
        booked: s?.booked ?? 0,
        waitlist: s?.waitlist ?? 0,
      });
    }
  }

  const workshopBlocks: WorkshopBlock[] = WORKSHOPS.map((workshop) => {
    const rows: WorkshopRow[] = [];
    for (const day of workshop.days) {
      for (const slot of day.slots) {
        const s = summary.get(slot.id);
        rows.push({
          slotId: slot.id,
          date: day.date,
          time: slot.time,
          capacity: slot.capacity,
          booked: s?.booked ?? 0,
          waitlist: s?.waitlist ?? 0,
        });
      }
    }
    rows.sort(
      (a, b) =>
        a.date.getTime() - b.date.getTime() || a.time.localeCompare(b.time),
    );

    return {
      slug: workshop.slug,
      title: workshop.title,
      hostedBy: workshop.hostedBy,
      rows,
      totalBooked: rows.reduce((sum, r) => sum + r.booked, 0),
      totalCapacity: rows.reduce((sum, r) => sum + r.capacity, 0),
      totalWaitlist: rows.reduce((sum, r) => sum + r.waitlist, 0),
    };
  });

  return { diningRows, workshopBlocks };
}

export function SlotsIndexTable() {
  const [typeFilter, setTypeFilter] = useState<
    "all" | "private-dining" | "workshop"
  >("all");
  const [workshopFilter, setWorkshopFilter] = useState<string>("all");

  const { data: summary, isLoading, error } = api.slots.summary.useQuery();

  const summaryMap = useMemo<SummaryMap>(() => {
    const m: SummaryMap = new Map();
    for (const row of summary ?? []) m.set(row.slotId, row);
    return m;
  }, [summary]);

  const { diningRows, workshopBlocks } = useMemo(
    () => buildRows(summaryMap),
    [summaryMap],
  );

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
          Failed to load slots: {error.message}
        </p>
      </div>
    );
  }

  const showDining = typeFilter === "all" || typeFilter === "private-dining";
  const showWorkshops = typeFilter === "all" || typeFilter === "workshop";
  const workshopFilterActive = workshopFilter !== "all";
  const visibleWorkshopBlocks = workshopFilterActive
    ? workshopBlocks.filter((b) => b.slug === workshopFilter)
    : workshopBlocks;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Select
          value={typeFilter}
          onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="private-dining">Private Dining</SelectItem>
            <SelectItem value="workshop">Workshops</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={workshopFilter}
          onValueChange={setWorkshopFilter}
          disabled={typeFilter === "private-dining"}
        >
          <SelectTrigger className="w-56">
            <SelectValue placeholder="All workshops" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Workshops</SelectItem>
            {WORKSHOPS.map((w) => (
              <SelectItem key={w.slug} value={w.slug}>
                {w.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showDining && !workshopFilterActive && (
        <section className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-semibold">Private Dining</h2>
            <p className="text-xs text-muted-foreground">
              {diningRows.length} session{diningRows.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Booked / Capacity</TableHead>
                  <TableHead>Waitlist</TableHead>
                  <TableHead className="w-24" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {diningRows.map((row) => (
                  <TableRow
                    key={row.slotId}
                    className={row.waitlist > 0 ? "bg-amber-50/50" : ""}
                  >
                    <TableCell className="font-medium">{row.title}</TableCell>
                    <TableCell>{eventDateFormat.dayName(row.date)}</TableCell>
                    <TableCell>{row.time}</TableCell>
                    <TableCell>
                      {row.booked} / {row.capacity}
                    </TableCell>
                    <TableCell>
                      {row.waitlist > 0 ? (
                        <Badge variant="secondary">{row.waitlist}</Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/admin/slots/${row.slotId}`}
                        className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                      >
                        View
                        <IconChevronRight className="size-3" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      )}

      {showWorkshops && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Workshops</h2>
          {visibleWorkshopBlocks.map((block) => (
            <WorkshopBlockView key={block.slug} block={block} />
          ))}
        </section>
      )}
    </div>
  );
}

function WorkshopBlockView({ block }: { block: WorkshopBlock }) {
  return (
    <div className="rounded-lg border">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-muted/30 px-4 py-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{block.title}</h3>
            {block.totalWaitlist > 0 && (
              <Badge variant="secondary">
                {block.totalWaitlist} waitlisted
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Hosted by {block.hostedBy} · {block.totalBooked} /{" "}
            {block.totalCapacity} booked
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={`/admin/workshops/${block.slug}`}>View workshop</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Booked / Capacity</TableHead>
            <TableHead>Waitlist</TableHead>
            <TableHead className="w-24" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {block.rows.map((row) => (
            <TableRow
              key={row.slotId}
              className={row.waitlist > 0 ? "bg-amber-50/50" : ""}
            >
              <TableCell>{eventDateFormat.dayName(row.date)}</TableCell>
              <TableCell>{row.time}</TableCell>
              <TableCell>
                {row.booked} / {row.capacity}
              </TableCell>
              <TableCell>
                {row.waitlist > 0 ? (
                  <Badge variant="secondary">{row.waitlist}</Badge>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Link
                  href={`/admin/slots/${row.slotId}`}
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  View slot
                  <IconChevronRight className="size-3" />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
