import { notFound } from "next/navigation";

import { getWorkshopBySlug } from "@/lib/config/workshops";
import { WorkshopDetail } from "./workshop-detail";

export default async function WorkshopDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const workshop = getWorkshopBySlug(slug);

  if (!workshop) notFound();

  const slots = workshop.days
    .flatMap((day) =>
      day.slots.map((slot) => ({
        slotId: slot.id,
        date: day.date.toISOString(),
        time: slot.time,
        capacity: slot.capacity,
      })),
    )
    .sort(
      (a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime() ||
        a.time.localeCompare(b.time),
    );

  return (
    <WorkshopDetail
      slug={workshop.slug}
      title={workshop.title}
      hostedBy={workshop.hostedBy}
      tagline={workshop.tagline}
      slots={slots}
    />
  );
}
