"use client";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { IconChevronRight, IconLoader2 } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { BookingRow } from "./booking-row";

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

  useEffect(() => {
    onCountsChange?.(slotId, { checkedIn, total: totalSeats });
  }, [slotId, checkedIn, totalSeats, onCountsChange]);

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
          <CountBadge checkedIn={checkedIn} total={totalSeats} />
        )}
      </button>
      {open && data && (
        <div className="ml-8 mt-1 space-y-1">
          {data.length === 0 ? (
            <p className="py-3 text-sm text-muted-foreground">
              No confirmed bookings
            </p>
          ) : (
            data.map((booking) => (
              <BookingRow key={booking.id} booking={booking} slotId={slotId} />
            ))
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
