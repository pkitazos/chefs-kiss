import type { Metadata } from "next";
import { DINING_DAYS } from "@/lib/config/private-dining";
import { PageLayout } from "@/components/page-layout";
import { SectionLabel } from "@/components/ui/section-label";
import { AnimateIn } from "@/components/animate-in";
import { DashPattern } from "@/components/brand-pattern";
import { DiningDaySlot } from "./dining-day-slot";

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
            <div className="flex gap-8 flex-col">
              <span className="font-display text-4xl sm:text-5xl md:text-6xl tracking-tight text-white drop-shadow-sm">
                Sea &amp; Fire
              </span>
              <p className="text-muted-foreground text-lg">
                Join us for an intimate dining experience crafted by renowned
                chefs. Each session features a curated multi-course menu with
                premium pairings, set in a stunning marina-side venue.
              </p>
            </div>
            <div className="aspect-4/3 rounded-2xl bg-sky-500" />
          </div>
        </AnimateIn>

        <div className="space-y-4">
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
