import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PageLayout } from "@/components/page-layout";
import { COMING_SOON } from "@/lib/config/mode";
import { getWorkshopBySlug, getWorkshopSlotById } from "@/lib/config/workshops";
import { WorkshopBookingForm } from "./booking-form";

export const metadata: Metadata = {
  title: "Book Workshop | Chef's Kiss Festival",
  description: "Book your spot at a workshop session.",
};

export default async function WorkshopBookPage({
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
      <WorkshopBookingForm
        workshopSlug={workshop.slug}
        workshopTitle={workshop.title}
        slotId={slotResult.slot.id}
        slotTime={slotResult.slot.time}
        slotShortDescription={slotResult.slot.shortDescription}
        slotDate={slotResult.day.date.toISOString()}
        price={slotResult.slot.price}
        capacity={slotResult.slot.capacity}
        maxSeatsPerBooking={workshop.maxSeatsPerBooking}
      />
    </PageLayout>
  );
}
