"use client";
import { Badge } from "@/components/ui/badge";
import { CURRENT_EVENT } from "@/lib/config/event";
import { DINING_DAYS } from "@/lib/config/private-dining";
import {
  WORKSHOPS,
  type WorkshopConfig,
  type WorkshopSlot,
} from "@/lib/config/workshops";
import { api } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { IconCheck, IconChevronRight, IconLoader2 } from "@tabler/icons-react";
import { eachDayOfInterval, format, isSameDay } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { LayoutGroup, motion } from "motion/react";

const EVENT_DAYS = eachDayOfInterval({
  start: CURRENT_EVENT.startDate,
  end: CURRENT_EVENT.endDate,
});

type SlotBooking = {
  id: string;
  fullName: string;
  email: string;
  seats: number;
  isCheckedIn: boolean;
};

type SlotCounts = { checkedIn: number; total: number };

export default function CheckInPage() {
  const today = new Date();
  const defaultDay = EVENT_DAYS.findIndex((d) => isSameDay(d, today));
  const [dayIndex, setDayIndex] = useState(defaultDay >= 0 ? defaultDay : 0);

  const selectedDate = EVENT_DAYS[dayIndex];

  const workshopsForDay = useMemo(
    () =>
      WORKSHOPS.map((workshop) => {
        const dayData = workshop.days.find((d) =>
          isSameDay(d.date, selectedDate),
        );
        if (!dayData || dayData.slots.length === 0) return null;
        return { workshop, slots: dayData.slots };
      }).filter((w) => w !== null),
    [selectedDate],
  );

  const diningForDay = useMemo(
    () =>
      DINING_DAYS.filter((d) => isSameDay(d.date, selectedDate)).flatMap(
        (d) => d.sessions,
      ),
    [selectedDate],
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <LayoutGroup>
        <div className="mx-auto flex w-max items-center gap-1 rounded-full border border-border/60 bg-background/75 p-1.5 shadow-lg backdrop-blur-md">
          {EVENT_DAYS.map((date, i) => {
            const isActive = i === dayIndex;
            return (
              <button
                key={date.toISOString()}
                onClick={() => setDayIndex(i)}
                className={cn(
                  "relative rounded-full px-5 py-2 text-lg font-semibold tracking-tight transition-colors duration-300",
                  isActive
                    ? "text-white"
                    : "text-foreground/70 hover:text-foreground",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="day-pill"
                    aria-hidden
                    className="absolute inset-0 -z-10 rounded-full bg-amber-600"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 32,
                    }}
                  />
                )}
                <span className="relative">{format(date, "EEE d")}</span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      {workshopsForDay.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-muted-foreground">
            Workshops
          </h2>
          <div className="space-y-2">
            {workshopsForDay.map(({ workshop, slots }) => (
              <WorkshopGroup
                key={workshop.slug}
                workshop={workshop}
                slots={slots}
              />
            ))}
          </div>
        </section>
      )}

      {diningForDay.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-muted-foreground">
            Private Dining
          </h2>
          <div className="space-y-2">
            {diningForDay.map((session) => (
              <SlotSection
                key={session.id}
                slotId={session.id}
                label={session.title}
                sublabel={session.time}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function WorkshopGroup({
  workshop,
  slots,
}: {
  workshop: WorkshopConfig;
  slots: WorkshopSlot[];
}) {
  const [open, setOpen] = useState(false);
  const [slotCounts, setSlotCounts] = useState<Record<string, SlotCounts>>({});

  const totalCheckedIn = Object.values(slotCounts).reduce(
    (sum, c) => sum + c.checkedIn,
    0,
  );
  const totalSeats = Object.values(slotCounts).reduce(
    (sum, c) => sum + c.total,
    0,
  );

  const handleCountsChange = useCallback(
    (slotId: string, counts: SlotCounts) => {
      setSlotCounts((prev) => {
        if (
          prev[slotId]?.checkedIn === counts.checkedIn &&
          prev[slotId]?.total === counts.total
        )
          return prev;
        return { ...prev, [slotId]: counts };
      });
    },
    [],
  );

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
          <span className="text-lg font-medium">{workshop.title}</span>
        </div>
        <CountBadge checkedIn={totalCheckedIn} total={totalSeats} />
      </button>
      <div className={cn("ml-4 mt-1 space-y-1", !open && "hidden")}>
        {slots.map((slot) => (
          <SlotSection
            key={slot.id}
            slotId={slot.id}
            label={slot.time}
            sublabel={slot.shortDescription}
            onCountsChange={handleCountsChange}
          />
        ))}
      </div>
    </div>
  );
}

function SlotSection({
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

function BookingRow({
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

function CountBadge({
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
