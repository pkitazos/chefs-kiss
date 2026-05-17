"use client";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { IconChevronRight, IconLoader2 } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { BookingRow } from "./booking-row";
import { HoldRow } from "./hold-row";

export type SlotCounts = { checkedIn: number; total: number };

export function SlotSection({
  slotId,
  label,
  sublabel,
  onCountsChange,
}: {
  slotId: string;
  label: string;
  sublabel?: string;
  onCountsChange?: (slotId: string, counts: SlotCounts) => void;
}) {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = api.checkin.getSlotBookings.useQuery({ slotId });
  const { data: holds } = api.checkin.getSlotHolds.useQuery({ slotId });

  const checkedIn = useMemo(
    () =>
      data?.filter((b) => b.isCheckedIn).reduce((sum, b) => sum + b.seats, 0) ??
      0,
    [data],
  );
  const totalSeats = useMemo(
    () => data?.reduce((sum, b) => sum + b.seats, 0) ?? 0,
    [data],
  );

  const holdsCheckedIn = useMemo(
    () =>
      holds
        ?.filter((h) => h.checkedInAt)
        .reduce((sum, h) => sum + h.seatCount, 0) ?? 0,
    [holds],
  );
  const holdsTotal = useMemo(
    () => holds?.reduce((sum, h) => sum + h.seatCount, 0) ?? 0,
    [holds],
  );

  useEffect(() => {
    onCountsChange?.(slotId, {
      checkedIn: checkedIn + holdsCheckedIn,
      total: totalSeats + holdsTotal,
    });
  }, [slotId, checkedIn, totalSeats, holdsCheckedIn, holdsTotal, onCountsChange]);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-lg border bg-card px-4 py-3 text-left"
      >
        <div className="flex items-center gap-3">
          <IconChevronRight
            className={cn(
              "size-5 text-muted-foreground transition-transform",
              open && "rotate-90",
            )}
          />
          <div>
            <span className="text-base font-medium">{label}</span>
            {sublabel && (
              <span className="ml-2 text-sm text-muted-foreground">
                {sublabel}
              </span>
            )}
          </div>
        </div>
        {isLoading ? (
          <IconLoader2 className="size-4 animate-spin text-muted-foreground" />
        ) : (
          <CountBadge
            checkedIn={checkedIn + holdsCheckedIn}
            total={totalSeats + holdsTotal}
          />
        )}
      </button>
      {open && data && (
        <div className="ml-8 mt-1 space-y-1">
          {data.length === 0 && (!holds || holds.length === 0) ? (
            <p className="py-3 text-sm text-muted-foreground">
              No confirmed bookings
            </p>
          ) : (
            <>
              {data.map((booking) => (
                <BookingRow
                  key={booking.id}
                  booking={booking}
                  slotId={slotId}
                />
              ))}
              {holds && holds.length > 0 && (
                <>
                  <p className="pt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Held seats
                  </p>
                  {holds.map((hold) => (
                    <HoldRow key={hold.id} hold={hold} slotId={slotId} />
                  ))}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function CountBadge({
  checkedIn,
  total,
}: {
  checkedIn: number;
  total: number;
}) {
  if (total === 0) return null;

  const allDone = checkedIn === total;
  return (
    <Badge variant={allDone ? "success" : "outline"}>
      {checkedIn}/{total}
    </Badge>
  );
}
