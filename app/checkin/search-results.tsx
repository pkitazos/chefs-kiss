"use client";
import { api } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { IconCheck } from "@tabler/icons-react";
import { useMemo } from "react";
import { toast } from "sonner";
import type { SlotBooking } from "./booking-row";

export type SlotContext = {
  slotId: string;
  slotLabel: string;
  parentLabel: string;
};

type EnrichedBooking = SlotBooking & SlotContext;

export function SearchResults({
  slots,
  query,
}: {
  slots: SlotContext[];
  query: string;
}) {
  const bookingQueries = api.useQueries((t) =>
    slots.map((slot) => t.checkin.getSlotBookings({ slotId: slot.slotId })),
  );

  const matches = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return [];

    const results: EnrichedBooking[] = [];
    for (let i = 0; i < slots.length; i++) {
      const data = bookingQueries[i]?.data;
      if (!data) continue;
      const slot = slots[i];
      for (const booking of data) {
        const middleSegment = booking.id.split("-")[1] ?? "";
        if (middleSegment.toLowerCase().includes(normalizedQuery)) {
          results.push({ ...booking, ...slot });
        }
      }
    }
    return results;
  }, [slots, bookingQueries, query]);

  if (matches.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground">
        No bookings match &ldquo;{query.trim()}&rdquo;
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {matches.map((booking) => (
        <SearchResultCard
          key={`${booking.slotId}-${booking.id}`}
          booking={booking}
        />
      ))}
    </div>
  );
}

function SearchResultCard({ booking }: { booking: EnrichedBooking }) {
  const utils = api.useUtils();
  const { slotId } = booking;

  const toggle = api.bookings.toggleCheckIn.useMutation({
    onMutate: async ({ bookingId }) => {
      await utils.checkin.getSlotBookings.cancel({ slotId });
      const prev = utils.checkin.getSlotBookings.getData({ slotId });
      utils.checkin.getSlotBookings.setData({ slotId }, (old) =>
        old?.map((b) =>
          b.id === bookingId ? { ...b, isCheckedIn: !b.isCheckedIn } : b,
        ),
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev)
        utils.checkin.getSlotBookings.setData({ slotId }, ctx.prev);
      toast.error("Failed to toggle check-in");
    },
    onSettled: () => {
      utils.checkin.getSlotBookings.invalidate({ slotId });
    },
  });

  return (
    <button
      onClick={() => toggle.mutate({ bookingId: booking.id })}
      disabled={toggle.isPending}
      aria-pressed={booking.isCheckedIn}
      className={cn(
        "flex w-full items-center gap-4 rounded-lg border px-4 py-3 text-left transition-colors",
        booking.isCheckedIn
          ? "border-green-500/30 bg-green-500/10 dark:border-green-400/30 dark:bg-green-400/10"
          : "bg-card",
        toggle.isPending && "opacity-50",
      )}
    >
      <div
        aria-hidden
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors",
          booking.isCheckedIn
            ? "bg-green-600 text-white"
            : "border-2 border-muted-foreground/30",
        )}
      >
        {booking.isCheckedIn && <IconCheck className="size-4" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-lg font-bold leading-tight">
          {booking.id}
        </p>
        <p className="text-sm text-muted-foreground">
          {booking.parentLabel} &middot; {booking.slotLabel}
        </p>
        <p className="truncate text-base">{booking.fullName}</p>
        <p className="truncate text-sm text-muted-foreground">
          {booking.email}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-base font-medium">
          {booking.seats} {booking.seats === 1 ? "seat" : "seats"}
        </p>
      </div>
    </button>
  );
}
