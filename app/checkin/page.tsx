"use client";
import { SignOutButton } from "@/app/admin/sign-out-button";
import { CURRENT_EVENT } from "@/lib/config/event";
import { DINING_DAYS } from "@/lib/config/private-dining";
import { WORKSHOPS } from "@/lib/config/workshops";
import { cn } from "@/lib/utils";
import { eachDayOfInterval, format, isSameDay } from "date-fns";
import Image from "next/image";
import { useMemo, useState } from "react";
import { LayoutGroup, motion } from "motion/react";
import { SlotSection } from "./slot-section";
import { WorkshopGroup } from "./workshop-group";

const EVENT_DAYS = eachDayOfInterval({
  start: CURRENT_EVENT.startDate,
  end: CURRENT_EVENT.endDate,
});

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
      <header className="flex items-center justify-between gap-4">
        <Image
          src="/favicon.svg"
          alt=""
          width={120}
          height={40}
          className="size-6 shrink-0"
        />
        <LayoutGroup>
          <div className="flex items-center gap-1 rounded-full border border-border/60 bg-background/75 p-1.5 backdrop-blur-md">
            {EVENT_DAYS.map((date, i) => {
              const isActive = i === dayIndex;
              return (
                <button
                  key={date.toISOString()}
                  onClick={() => setDayIndex(i)}
                  className={cn(
                    "relative rounded-full px-4 py-1.5 text-sm font-semibold tracking-tight transition-colors duration-300",
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
        <SignOutButton />
      </header>

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
