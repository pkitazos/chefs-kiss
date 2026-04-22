import type { Metadata } from "next";
import Link from "next/link";
import { DINING_DAYS, DiningDay, eventDateFormat } from "@/lib/config/event";
import { COMING_SOON } from "@/lib/config/mode";
import { PageLayout } from "@/components/page-layout";
import { SectionLabel } from "@/components/ui/section-label";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimateIn } from "@/components/animate-in";
import { DashPattern } from "@/components/brand-pattern";
import { IconToolsKitchen2 } from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "Private Dining | Chef's Kiss Festival",
  description:
    "Reserve your seat at an exclusive private dining experience during the Chef's Kiss Festival.",
};

export default function PrivateDiningPage() {
  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden bg-[#edede9]">
        <DashPattern className="absolute inset-0 text-amber-400/30" />
        {/* Decorative blue circle accent */}
        <div
          aria-hidden
          className="absolute -right-16 -top-16 size-64 rounded-full bg-[#457b9d]/10"
        />
        <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <AnimateIn>
            <SectionLabel>An Exclusive Culinary Experience</SectionLabel>
            <h1 className="mt-3 font-display text-5xl tracking-tight">
              Private Dining
            </h1>
          </AnimateIn>
        </div>
      </div>

      <PageLayout>
        <AnimateIn className="mb-12">
          <div className="grid grid-cols-1 items-start gap-8 sm:grid-cols-2">
            <p className="text-muted-foreground text-lg">
              Join us for an intimate dining experience crafted by renowned
              chefs. Each session features a curated multi-course menu with
              premium pairings, set in a stunning marina-side venue.
            </p>
            <div className="aspect-4/3 rounded-2xl bg-sky-500" />
          </div>
        </AnimateIn>

        <div className="space-y-10">
          {DINING_DAYS.map((day) => (
            <AnimateIn key={day.date.toISOString()}>
              <DiningDaySlot day={day} />
            </AnimateIn>
          ))}
        </div>
      </PageLayout>
    </>
  );
}

function DiningDaySlot({ day }: { day: DiningDay }) {
  return (
    <div className="space-y-1">
      <h2 className="text-xl font-semibold">
        {eventDateFormat.dayName(day.date)}
      </h2>

      <div className="divide-y">
        {day.sessions.map((session) => (
          <div
            key={session.id}
            className="flex flex-col gap-4 py-5 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between sm:px-3 sm:rounded-lg"
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
              {!COMING_SOON && (
                <span className="text-sm font-semibold text-primary">
                  &euro;{session.price}
                  <span className="text-muted-foreground font-normal">
                    /person
                  </span>
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
                <Link
                  href={`/private-dining/book?session=${session.id}`}
                  className={cn(buttonVariants({ size: "cta" }))}
                >
                  <IconToolsKitchen2 />
                  Reserve
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
