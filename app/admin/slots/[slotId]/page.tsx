import { notFound } from "next/navigation";

import { getDiningSessionById } from "@/lib/config/private-dining";
import { getWorkshopSlotById } from "@/lib/config/workshops";
import { SlotDetail } from "./slot-detail";

export default async function SlotDetailPage({
  params,
}: {
  params: Promise<{ slotId: string }>;
}) {
  const { slotId } = await params;

  const dining = getDiningSessionById(slotId);
  if (dining) {
    return (
      <SlotDetail
        slotId={slotId}
        type="private-dining"
        title={dining.session.title}
        date={dining.day.date.toISOString()}
        time={dining.session.time}
        capacity={dining.session.capacity}
        price={dining.session.price}
      />
    );
  }

  const workshop = getWorkshopSlotById(slotId);
  if (workshop) {
    return (
      <SlotDetail
        slotId={slotId}
        type="workshop"
        title={workshop.workshop.title}
        workshopSlug={workshop.workshop.slug}
        date={workshop.day.date.toISOString()}
        time={workshop.slot.time}
        capacity={workshop.slot.capacity}
        price={workshop.slot.price}
      />
    );
  }

  notFound();
}
