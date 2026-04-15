import type { Metadata } from "next";
import Link from "next/link";
import { DINING_DAYS, DiningDay, eventDateFormat } from "@/lib/config/event";
import { PageLayout } from "@/components/page-layout";
import { SectionLabel } from "@/components/ui/section-label";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Private Dining | Chef's Kiss Festival",
  description:
    "Reserve your seat at an exclusive private dining experience during the Chef's Kiss Festival.",
};

export default function PrivateDiningPage() {
  return (
    <PageLayout>
      <div className="mb-12 space-y-4">
        <div className="mb-12">
          <h1 className="text-5xl font-bold tracking-tight">
            Private Dining
          </h1>
          <SectionLabel>An Exclusive Culinary Experience</SectionLabel>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 sm:grid-cols-2">
          <p className="text-muted-foreground text-lg">
            Join us for an intimate dining experience crafted by renowned
            chefs. Each session features a curated multi-course menu with
            premium pairings, set in a stunning marina-side venue.
          </p>
          <div className="aspect-4/3 rounded-2xl bg-sky-500" />
        </div>
      </div>

      <div className="space-y-10">
        {DINING_DAYS.map((day) => (
          <DiningDaySlot key={day.date.toISOString()} day={day} />
        ))}
      </div>
    </PageLayout>
  );
}

function DiningDaySlot({ day }: { day: DiningDay }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        {eventDateFormat.dayName(day.date)}
      </h2>

      <div className="space-y-3">
        {day.sessions.map((session) => (
          <div
            key={session.id}
            className="flex flex-col gap-4 rounded-lg border p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-1">
              <h3 className="font-medium">{session.title}</h3>
              <p className="text-muted-foreground text-sm">
                {session.time} &middot; {session.location}
              </p>
              <p className="text-muted-foreground text-sm">
                {session.description}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <span className="text-sm font-semibold">
                &euro;{session.price}
                <span className="text-muted-foreground font-normal">
                  /person
                </span>
              </span>
              <Link
                href={`/private-dining/book?session=${session.id}`}
                className={cn(buttonVariants({ size: "lg" }))}
              >
                Reserve
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
