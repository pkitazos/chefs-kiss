"use client";

import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { api } from "@/lib/trpc/client";

interface WaitlistActionDialogProps {
  open: boolean;
  action: "promote" | "remove" | null;
  entryId: string;
  email: string;
  fullName: string;
  partySize: number;
  capacity: number;
  bookedSeats: number;
  onOpenChange: (open: boolean) => void;
}

export function WaitlistActionDialog({
  open,
  action,
  entryId,
  email,
  fullName,
  partySize,
  capacity,
  bookedSeats,
  onOpenChange,
}: WaitlistActionDialogProps) {
  const utils = api.useUtils();

  const promote = api.waitlist.promote.useMutation({
    onSuccess: () => {
      utils.slots.bySlot.invalidate();
      utils.slots.summary.invalidate();
      utils.bookings.adminList.invalidate();
      onOpenChange(false);
      toast.success("Promoted — confirmation email sent to " + email);
    },
    onError: (err) => {
      toast.error("Failed to promote", { description: err.message });
    },
  });

  const cancel = api.waitlist.cancel.useMutation({
    onSuccess: () => {
      utils.slots.bySlot.invalidate();
      utils.slots.summary.invalidate();
      onOpenChange(false);
      toast.success("Waitlist entry removed");
    },
    onError: (err) => {
      toast.error("Failed to remove", { description: err.message });
    },
  });

  const pending = promote.isPending || cancel.isPending;
  const remaining = capacity - bookedSeats;
  const overBy = partySize - remaining;
  const willOverfill = action === "promote" && overBy > 0;

  const handleConfirm = () => {
    if (action === "promote") promote.mutate({ id: entryId });
    else if (action === "remove") cancel.mutate({ id: entryId });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {action === "promote"
              ? "Promote from waitlist"
              : "Remove from waitlist"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {action === "promote"
              ? `This will create a confirmed booking for ${fullName} (party of ${partySize}), flagged as pay-on-the-day. A confirmation email will be sent to ${email}.`
              : `This will cancel the waitlist entry for ${fullName}. No email will be sent.`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {willOverfill && (
          <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
            This will put the slot <strong>{overBy} over capacity.</strong>{" "}
            Proceed only if you&apos;ve confirmed the extra seats can be
            accommodated.
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant={action === "remove" ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={pending}
          >
            {pending
              ? "Processing..."
              : action === "promote"
                ? "Promote"
                : "Remove"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
