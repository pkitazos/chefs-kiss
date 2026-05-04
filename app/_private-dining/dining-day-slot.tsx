"use client";

import Link from "next/link";
import {
  IconHourglass,
  IconLoader2,
  IconToolsKitchen2,
} from "@tabler/icons-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { eventDateFormat } from "@/lib/config/event";
import { COMING_SOON } from "@/lib/config/mode";
import type { DiningDay, DiningSession } from "@/lib/config/private-dining";
import { api } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";

export function DiningDaySlot({ day }: { day: DiningDay }) {
  return (
    <div className="space-y-4">
      {day.sessions.map((session) => (
        <DiningSessionRow key={session.id} day={day} session={session} />
      ))}
    </div>
  );
}

function DiningSessionRow({
  day,
  session,
}: {
  day: DiningDay;
  session: DiningSession;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border p-5 transition-colors hover:border-primary/30 hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h3 className="font-display text-lg font-semibold">
          {eventDateFormat.dayName(day.date)}
        </h3>
        <p className="text-muted-foreground text-sm">
          {session.time} &middot; {session.location}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-4">
        {!COMING_SOON && (
          <span className="text-sm font-semibold text-primary">
            &euro;{session.price}
            <span className="text-muted-foreground font-normal">/person</span>
          </span>
        )}
        {COMING_SOON ? (
          <button
            type="button"
            disabled
            className={cn(
              buttonVariants({ size: "cta" }),
              "cursor-not-allowed opacity-60",
            )}
          >
            Reservations opening soon…
          </button>
        ) : (
          <SessionActionButton sessionId={session.id} />
        )}
      </div>
    </div>
  );
}

function SessionActionButton({ sessionId }: { sessionId: string }) {
  const availability = api.bookings.getSlotAvailability.useQuery({
    slotId: sessionId,
  });

  const available = availability.data?.available;
  const isLoading = available === undefined;
  const isFullyBooked = !isLoading && available <= 0;

  if (isLoading) {
    return (
      <Button size="cta" disabled>
        <IconLoader2 className="animate-spin" />
        Checking availability…
      </Button>
    );
  }

  if (isFullyBooked) {
    return (
      <Link
        href={`/private-dining/waitlist?session=${sessionId}`}
        className={cn(buttonVariants({ size: "cta", variant: "outline" }))}
      >
        <IconHourglass />
        Join the Waitlist
      </Link>
    );
  }

  return (
    <Link
      href={`/private-dining/book?session=${sessionId}`}
      className={cn(buttonVariants({ size: "cta" }))}
    >
      <IconToolsKitchen2 />
      Reserve
    </Link>
  );
}
