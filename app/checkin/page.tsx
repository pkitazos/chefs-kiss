"use client";
import { SignOutButton } from "@/app/admin/sign-out-button";
import { CURRENT_EVENT } from "@/lib/config/event";
import { DINING_DAYS } from "@/lib/config/private-dining";
import { WORKSHOPS } from "@/lib/config/workshops";
import { cn } from "@/lib/utils";
import { IconSearch, IconX } from "@tabler/icons-react";
import { eachDayOfInterval, format, isSameDay } from "date-fns";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { LayoutGroup, motion } from "motion/react";
import { SearchResults, type SlotContext } from "./search-results";
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
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedDate = EVENT_DAYS[dayIndex];
  const isSearching = searchQuery.trim().length > 0;

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

  const allSlots = useMemo<SlotContext[]>(() => {
    const slots: SlotContext[] = [];
    for (const { workshop, slots: workshopSlots } of workshopsForDay) {
      for (const slot of workshopSlots) {
        slots.push({
          slotId: slot.id,
          slotLabel: slot.time,
          parentLabel: workshop.title,
        });
      }
    }
    for (const session of diningForDay) {
      slots.push({
        slotId: session.id,
        slotLabel: session.time,
        parentLabel: session.title,
      });
    }
    return slots;
  }, [workshopsForDay, diningForDay]);

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

      <div className="relative">
        <IconSearch className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setSearchQuery("");
              inputRef.current?.blur();
            }
          }}
          placeholder="Search by booking ID..."
          className="w-full rounded-full border bg-card py-3 pl-10 pr-10 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {isSearching && (
          <button
            onClick={() => {
              setSearchQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <IconX className="size-5" />
          </button>
        )}
      </div>

      {isSearching ? (
        <SearchResults slots={allSlots} query={searchQuery} />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
