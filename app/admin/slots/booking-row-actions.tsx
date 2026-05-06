"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ConfirmActionDialog } from "@/components/confirm-action-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type Booking } from "@/lib/db/schema";
import { api } from "@/lib/trpc/client";
import { formatDate } from "@/lib/utils/format-date";
import { copyToClipboard } from "@/lib/utils";
import {
  IconCopy,
  IconDotsVertical,
  IconMail,
  IconX,
} from "@tabler/icons-react";

export function BookingRowActions({ booking }: { booking: Booking }) {
  const {
    id: bookingId,
    email,
    fullName,
    seats,
    status,
    confirmationEmailSentAt,
  } = booking;
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [resendOpen, setResendOpen] = useState(false);
  const [cancelNote, setCancelNote] = useState("");
  const [sendCancelEmail, setSendCancelEmail] = useState(
    status === "confirmed",
  );
  const utils = api.useUtils();

  const cancel = api.bookings.cancel.useMutation({
    onSuccess: (_data, variables) => {
      utils.slots.bySlot.invalidate();
      utils.slots.summary.invalidate();
      utils.bookings.adminList.invalidate();
      setConfirmCancelOpen(false);
      setCancelNote("");
      toast.success(
        variables.sendEmail
          ? `Booking cancelled - email sent to ${email}`
          : "Booking cancelled - no email sent",
      );
    },
    onError: (err) => {
      toast.error("Failed to cancel booking", { description: err.message });
    },
  });

  const resend = api.bookings.resendConfirmation.useMutation({
    onSuccess: () => {
      utils.slots.bySlot.invalidate();
      utils.bookings.adminList.invalidate();
      setResendOpen(false);
      toast.success(`Confirmation email sent to ${email}`);
    },
    onError: (err) => {
      toast.error("Failed to send confirmation email", {
        description: err.message,
      });
    },
  });

  const canCancel = status === "pending" || status === "confirmed";

  const handleCopyEmail = async () => {
    await copyToClipboard(email).then(() =>
      toast.success("Email copied to clipboard"),
    );
  };

  const handleCancelOpen = (open: boolean) => {
    setConfirmCancelOpen(open);
    if (!open) {
      setCancelNote("");
      setSendCancelEmail(status === "confirmed");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-xs">
            <IconDotsVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setConfirmCancelOpen(true)}
            disabled={!canCancel}
          >
            <IconX />
            Cancel booking
          </DropdownMenuItem>
          {status === "confirmed" && (
            <DropdownMenuItem onClick={() => setResendOpen(true)}>
              <IconMail />
              Resend confirmation email
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleCopyEmail}>
            <IconCopy />
            Copy Email
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmActionDialog
        open={confirmCancelOpen}
        onOpenChange={handleCancelOpen}
        title="Cancel booking"
        description={`Cancel booking ${bookingId} for ${fullName} (${seats} seat${seats === 1 ? "" : "s"}). Seats will be moved to admin-held. You can allocate them to a waitlist customer or release them to the public from the slot view.`}
        confirmLabel="Cancel booking"
        pendingLabel="Cancelling..."
        cancelLabel="Back"
        variant="destructive"
        isPending={cancel.isPending}
        onConfirm={() =>
          cancel.mutate({
            id: bookingId,
            note: cancelNote.trim() || undefined,
            sendEmail: sendCancelEmail,
          })
        }
      >
        <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          <strong className="text-destructive">
            No refund will be issued automatically.
          </strong>{" "}
          If a refund is owed, process it manually in Payabl dashboard.
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cancel-note" className="text-sm">
            Internal note (optional)
          </Label>
          <Textarea
            id="cancel-note"
            placeholder={`From cancelled booking ${bookingId}`}
            value={cancelNote}
            onChange={(e) => setCancelNote(e.target.value)}
            disabled={cancel.isPending}
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground">
            For internal use only - not sent to the user. Leave blank to use
            default or make a note of why this booking is being cancelled.
          </p>
        </div>

        <div className="flex items-start gap-2">
          <Checkbox
            id="send-cancellation-email"
            checked={sendCancelEmail}
            onCheckedChange={(c) => setSendCancelEmail(c === true)}
            disabled={cancel.isPending}
          />
          <Label
            htmlFor="send-cancellation-email"
            className="text-sm font-normal leading-snug"
          >
            Send cancellation email to{" "}
            <span className="text-secondary">{email}</span>
          </Label>
        </div>
      </ConfirmActionDialog>

      <ConfirmActionDialog
        open={resendOpen}
        onOpenChange={setResendOpen}
        title="Resend confirmation email"
        description={`${fullName} — ${email}`}
        confirmLabel="Send email"
        pendingLabel="Sending..."
        cancelLabel="Close"
        isPending={resend.isPending}
        onConfirm={() => resend.mutate({ bookingId })}
      >
        {confirmationEmailSentAt ? (
          <p className="text-sm text-muted-foreground">
            Last sent: {formatDate(confirmationEmailSentAt)}
          </p>
        ) : (
          <p className="text-sm font-medium text-amber-600">Never sent</p>
        )}
        <p className="text-sm text-muted-foreground">
          This will send the standard confirmation email to{" "}
          <span className="text-secondary">{email}</span>. They will receive a
          duplicate if their original confirmation went through.
        </p>
      </ConfirmActionDialog>
    </>
  );
}
