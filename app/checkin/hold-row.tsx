"use client";
import { api } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { IconCheck } from "@tabler/icons-react";
import { toast } from "sonner";

type Hold = {
  id: string;
  seatCount: number;
  note: string | null;
  checkedInAt: Date | null;
};

export function HoldRow({ hold, slotId }: { hold: Hold; slotId: string }) {
  const utils = api.useUtils();
  const isCheckedIn = hold.checkedInAt !== null;

  const toggle = api.checkin.toggleHoldCheckIn.useMutation({
    onMutate: async ({ holdId }) => {
      await utils.checkin.getSlotHolds.cancel({ slotId });
      const prev = utils.checkin.getSlotHolds.getData({ slotId });
      utils.checkin.getSlotHolds.setData({ slotId }, (old) =>
        old?.map((h) =>
          h.id === holdId
            ? { ...h, checkedInAt: h.checkedInAt ? null : new Date() }
            : h,
        ),
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev)
        utils.checkin.getSlotHolds.setData({ slotId }, ctx.prev);
      toast.error("Failed to toggle check-in");
    },
    onSettled: () => {
      utils.checkin.getSlotHolds.invalidate({ slotId });
    },
  });

  return (
    <button
      onClick={() => toggle.mutate({ holdId: hold.id })}
      disabled={toggle.isPending}
      aria-pressed={isCheckedIn}
      className={cn(
        "flex w-full items-center gap-4 rounded-lg border border-dashed px-4 py-3 text-left transition-colors",
        isCheckedIn
          ? "border-green-500/30 bg-green-500/10 dark:border-green-400/30 dark:bg-green-400/10"
          : "bg-card",
        toggle.isPending && "opacity-50",
      )}
    >
      <div
        aria-hidden
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors",
          isCheckedIn
            ? "bg-green-600 text-white"
            : "border-2 border-dashed border-muted-foreground/30",
        )}
      >
        {isCheckedIn && <IconCheck className="size-4" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted-foreground">
          {hold.note || "Held seat"}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-base font-medium">
          {hold.seatCount} {hold.seatCount === 1 ? "seat" : "seats"}
        </p>
      </div>
    </button>
  );
}
