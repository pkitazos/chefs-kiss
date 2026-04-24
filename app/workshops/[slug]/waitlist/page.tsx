import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PageLayout } from "@/components/page-layout";
import { COMING_SOON } from "@/lib/config/mode";
import { getWorkshopBySlug, getWorkshopSlotById } from "@/lib/config/workshops";
import { WorkshopWaitlistForm } from "./waitlist-form";

export const metadata: Metadata = {
  title: "Join Waitlist | Chef's Kiss Festival",
  description: "Join the waitlist for a workshop session.",
};

export default async function WorkshopWaitlistPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ slot?: string }>;
}) {
  const { slug } = await params;
  const { slot: slotId } = await searchParams;

  if (COMING_SOON) {
    redirect(`/workshops/${slug}`);
  }

  const workshop = getWorkshopBySlug(slug);
  if (!workshop) {
    redirect("/workshops");
  }

  if (!slotId) {
    redirect(`/workshops/${slug}`);
  }

  const slotResult = getWorkshopSlotById(slotId);
  if (!slotResult || slotResult.workshop.slug !== slug) {
    redirect(`/workshops/${slug}`);
  }

  return (
    <PageLayout className="max-w-2xl">
      <WorkshopWaitlistForm
        workshopSlug={workshop.slug}
        workshopTitle={workshop.title}
        slotId={slotResult.slot.id}
        slotTime={slotResult.slot.time}
        slotLocation={slotResult.slot.location}
        slotShortDescription={slotResult.slot.shortDescription}
        slotDate={slotResult.day.date.toISOString()}
        price={slotResult.slot.price}
        maxSeatsPerBooking={workshop.maxSeatsPerBooking}
      />
    </PageLayout>
  );
}
