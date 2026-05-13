"use client";
import {
  type WorkshopConfig,
  type WorkshopSlot,
} from "@/lib/config/workshops";
import { cn } from "@/lib/utils";
import { IconChevronRight } from "@tabler/icons-react";
import { useCallback, useState } from "react";
import { CountBadge, SlotSection, type SlotCounts } from "./slot-section";

export function WorkshopGroup({
  workshop,
  slots,
}: {
  workshop: WorkshopConfig;
  slots: WorkshopSlot[];
}) {
  const [open, setOpen] = useState(false);
  const [slotCounts, setSlotCounts] = useState<Record<string, SlotCounts>>({});

  const totalCheckedIn = Object.values(slotCounts).reduce(
    (sum, c) => sum + c.checkedIn,
    0,
  );
  const totalSeats = Object.values(slotCounts).reduce(
    (sum, c) => sum + c.total,
    0,
  );

  const handleCountsChange = useCallback(
    (slotId: string, counts: SlotCounts) => {
      setSlotCounts((prev) => {
        if (
          prev[slotId]?.checkedIn === counts.checkedIn &&
          prev[slotId]?.total === counts.total
        )
          return prev;
        return { ...prev, [slotId]: counts };
      });
    },
    [],
  );

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-lg border bg-card px-4 py-3 text-left"
      >
        <div className="flex items-center gap-3">
          <IconChevronRight
            className={cn(
              "size-5 text-muted-foreground transition-transform",
              open && "rotate-90",
            )}
          />
          <span className="text-lg font-medium">{workshop.title}</span>
        </div>
        <CountBadge checkedIn={totalCheckedIn} total={totalSeats} />
      </button>
      <div className={cn("ml-4 mt-1 space-y-1", !open && "hidden")}>
        {slots.map((slot) => (
          <SlotSection
            key={slot.id}
            slotId={slot.id}
            label={slot.time}
            sublabel={slot.shortDescription}
            onCountsChange={handleCountsChange}
          />
        ))}
      </div>
    </div>
  );
}
