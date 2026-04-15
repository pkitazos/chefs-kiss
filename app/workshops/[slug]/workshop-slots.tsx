"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WorkshopConfig } from "@/lib/config/workshops";
import { api } from "@/lib/trpc/client";

export function WorkshopSlots({ workshop }: { workshop: WorkshopConfig }) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const selectedDay = workshop.days[selectedDayIndex];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Available Sessions</h2>

      <div className="flex gap-3">
        {workshop.days.map((day, i) => {
          const isSelected = i === selectedDayIndex;
          return (
            <button
              key={day.date.toISOString()}
              onClick={() => setSelectedDayIndex(i)}
              className={cn(
                "flex size-20 flex-col items-center justify-center rounded-lg border-2 transition-colors",
                isSelected
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/50",
              )}
            >
              <span className="text-2xl font-bold">
                {format(day.date, "d")}
              </span>
              <span className="text-xs uppercase tracking-wide">
                {format(day.date, "EEE")}
              </span>
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {selectedDay.slots.map((slot) => (
          <SlotRow
            key={slot.id}
            slotId={slot.id}
            time={slot.time}
            location={slot.location}
            workshopSlug={workshop.slug}
          />
        ))}
      </div>
    </div>
  );
}

function SlotRow({
  slotId,
  time,
  location,
  workshopSlug,
}: {
  slotId: string;
  time: string;
  location: string;
  workshopSlug: string;
}) {
  const availability = api.bookings.getSlotAvailability.useQuery({
    slotId,
  });

  const remaining = availability.data?.remaining;
  const isFullyBooked = remaining !== undefined && remaining <= 0;

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-0.5">
        <p className="text-sm font-medium">{time}</p>
        <p className="text-muted-foreground text-sm">{location}</p>
        {remaining !== undefined && (
          <p className="text-muted-foreground text-xs">
            {isFullyBooked
              ? "Fully booked"
              : `${remaining} seat${remaining === 1 ? "" : "s"} remaining`}
          </p>
        )}
      </div>
      {isFullyBooked ? (
        <span className="text-muted-foreground text-sm">Unavailable</span>
      ) : (
        <Link
          href={`/workshops/${workshopSlug}/book?slot=${slotId}`}
          className={cn(buttonVariants({ size: "cta" }))}
        >
          Book Now
        </Link>
      )}
    </div>
  );
}
