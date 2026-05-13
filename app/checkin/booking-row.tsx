"use client";
import { api } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { IconCheck } from "@tabler/icons-react";
import { toast } from "sonner";

export type SlotBooking = {
  id: string;
  fullName: string;
  email: string;
  seats: number;
  isCheckedIn: boolean;
};

export function BookingRow({
  booking,
  slotId,
}: {
  booking: SlotBooking;
  slotId: string;
}) {
  const utils = api.useUtils();

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
    <div
      className={cn(
        "flex items-center gap-4 rounded-lg border px-4 py-3 transition-colors",
        booking.isCheckedIn &&
          "border-green-500/30 bg-green-500/10 dark:border-green-400/30 dark:bg-green-400/10",
      )}
    >
      <button
        onClick={() => toggle.mutate({ bookingId: booking.id })}
        disabled={toggle.isPending}
        aria-checked={booking.isCheckedIn}
        aria-label={`Check in ${booking.fullName}`}
        role="checkbox"
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-lg border-2 transition-colors",
          booking.isCheckedIn
            ? "border-green-600 bg-green-600/40 text-white"
            : "border-muted-foreground/30 bg-background",
          toggle.isPending && "opacity-50",
        )}
      >
        {booking.isCheckedIn && <IconCheck className="size-6" />}
      </button>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-lg font-bold leading-tight">
          {booking.id}
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
    </div>
  );
}
