"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ConfirmActionDialog } from "@/components/confirm-action-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SeatBreakdown } from "@/lib/db/seat-counting";
import { api } from "@/lib/trpc/client";
import { copyToClipboard } from "@/lib/utils";
import {
  IconBan,
  IconCheck,
  IconCopy,
  IconDotsVertical,
  IconX,
} from "@tabler/icons-react";

type Action = "promote" | "remove" | "revoke";

interface WaitlistRowActionsProps {
  entryId: string;
  email: string;
  fullName: string;
  partySize: number;
  breakdown: SeatBreakdown;
  status: "waiting" | "promoted" | "cancelled" | "revoked";
}

export function WaitlistRowActions({
  entryId,
  email,
  fullName,
  partySize,
  breakdown,
  status,
}: WaitlistRowActionsProps) {
  const utils = api.useUtils();
  const [openAction, setOpenAction] = useState<Action | null>(null);
  const close = () => setOpenAction(null);

  const promote = api.waitlist.promote.useMutation({
    onSuccess: () => {
      utils.slots.bySlot.invalidate();
      utils.slots.summary.invalidate();
      utils.bookings.adminList.invalidate();
      close();
      toast.success("Promoted - payment link sent to " + email);
    },
    onError: (err) =>
      toast.error("Failed to promote", { description: err.message }),
  });

  const cancel = api.waitlist.cancel.useMutation({
    onSuccess: () => {
      utils.slots.bySlot.invalidate();
      utils.slots.summary.invalidate();
      close();
      toast.success("Waitlist entry removed");
    },
    onError: (err) =>
      toast.error("Failed to remove", { description: err.message }),
  });

  const revoke = api.waitlist.revoke.useMutation({
    onSuccess: () => {
      utils.slots.bySlot.invalidate();
      utils.slots.summary.invalidate();
      utils.bookings.adminList.invalidate();
      close();
      toast.success("Waitlist entry revoked");
    },
    onError: (err) =>
      toast.error("Failed to revoke", { description: err.message }),
  });

  const totalAfter = breakdown.booked + breakdown.reserved + partySize;
  const overfillWarning = totalAfter > breakdown.capacity && (
    <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
      This will bring total bookings to{" "}
      <strong>
        {totalAfter} of {breakdown.capacity} seats.
      </strong>{" "}
      {breakdown.held > 0 &&
        `${breakdown.held} seat${breakdown.held === 1 ? " is" : "s are"} currently held separately. `}
      Proceed only if you&apos;ve confirmed the extra seats can be accommodated.
    </div>
  );

  const handleCopyEmail = async () => {
    await copyToClipboard(email).then(() =>
      toast.success("Email copied to clipboard"),
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) close();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-xs">
            <IconDotsVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {status === "waiting" && (
            <>
              <DropdownMenuItem
                onClick={() => setOpenAction("promote")}
                variant="success"
              >
                <IconCheck />
                Promote
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setOpenAction("remove")}
                variant="destructive"
              >
                <IconX />
                Remove
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          {status === "promoted" && (
            <>
              <DropdownMenuItem
                onClick={() => setOpenAction("revoke")}
                variant="destructive"
              >
                <IconBan />
                Revoke
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={handleCopyEmail}>
            <IconCopy />
            Copy Email
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmActionDialog
        open={openAction === "promote"}
        onOpenChange={handleOpenChange}
        title="Promote from waitlist"
        description={`This will reserve seats for ${fullName} (party of ${partySize}) and email them a payment link.`}
        confirmLabel="Promote"
        isPending={promote.isPending}
        onConfirm={() => promote.mutate({ id: entryId })}
      >
        {overfillWarning}
      </ConfirmActionDialog>

      <ConfirmActionDialog
        open={openAction === "remove"}
        onOpenChange={handleOpenChange}
        title="Remove from waitlist"
        description={`This will cancel the waitlist entry for ${fullName}. No email will be sent.`}
        confirmLabel="Remove"
        variant="destructive"
        isPending={cancel.isPending}
        onConfirm={() => cancel.mutate({ id: entryId })}
      />

      <ConfirmActionDialog
        open={openAction === "revoke"}
        onOpenChange={handleOpenChange}
        title="Revoke promotion"
        description={`This will cancel ${fullName}'s pending booking, mark the waitlist entry as revoked, and release the seats to the held bucket. The customer's payment link will stop working immediately.`}
        confirmLabel="Revoke"
        variant="destructive"
        isPending={revoke.isPending}
        onConfirm={() => revoke.mutate({ id: entryId })}
      />
    </>
  );
}
