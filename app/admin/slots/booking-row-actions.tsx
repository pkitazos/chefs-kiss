"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/trpc/client";
import { copyToClipboard } from "@/lib/utils";
import { IconCash, IconCopy, IconDotsVertical } from "@tabler/icons-react";

interface BookingRowActionsProps {
  bookingId: string;
  email: string;
  fullName: string;
  paymentMethod: "online" | "in-person";
  paidAt: Date | null;
}

export function BookingRowActions({
  bookingId,
  email,
  fullName,
  paymentMethod,
  paidAt,
}: BookingRowActionsProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const utils = api.useUtils();

  const markPaid = api.bookings.markPaid.useMutation({
    onSuccess: () => {
      utils.slots.bySlot.invalidate();
      utils.bookings.adminList.invalidate();
      setConfirmOpen(false);
      toast.success("Marked as paid");
    },
    onError: (err) => {
      toast.error("Failed to mark as paid", { description: err.message });
    },
  });

  const canMarkPaid = paymentMethod === "in-person" && paidAt === null;

  const handleCopyEmail = async () => {
    await copyToClipboard(email).then(() =>
      toast.success("Email copied to clipboard"),
    );
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
          <DropdownMenuItem
            onClick={() => setConfirmOpen(true)}
            disabled={!canMarkPaid}
          >
            <IconCash />
            Mark as paid
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleCopyEmail}>
            <IconCopy />
            Copy Email
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark booking as paid</AlertDialogTitle>
            <AlertDialogDescription>
              Record that {fullName} paid for booking {bookingId} in person.
              This cannot be undone here.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={markPaid.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => markPaid.mutate({ id: bookingId })}
              disabled={markPaid.isPending}
            >
              {markPaid.isPending ? "Processing..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
