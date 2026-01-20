"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/trpc/client";
import { toast } from "sonner";

interface StatusUpdateDialogProps {
  open: boolean;
  action: "approved" | "rejected" | null;
  applicationId: string;
  businessName: string;
  email: string;
  onOpenChange: (open: boolean) => void;
}

export function StatusUpdateDialog({
  open,
  action,
  applicationId,
  businessName,
  email,
  onOpenChange,
}: StatusUpdateDialogProps) {
  const [reason, setReason] = useState("");
  const utils = api.useUtils();

  const updateStatus = api.vendors.updateApplicationStatus.useMutation({
    onSuccess: () => {
      utils.vendors.getAllApplications.invalidate();
      onOpenChange(false);
      setReason("");
      toast.success(
        `Application ${action === "approved" ? "approved" : "rejected"}`,
        {
          description: `${businessName} - Email sent to ${email}`,
        }
      );
    },
    onError: (error) => {
      toast.error("Failed to update status", { description: error.message });
    },
  });

  const handleConfirm = () => {
    if (action) {
      updateStatus.mutate({
        id: applicationId,
        status: action,
        reason: action === "rejected" ? reason : undefined,
      });
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setReason("");
    }
    onOpenChange(newOpen);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {action === "approved"
              ? "Approve Application"
              : "Reject Application"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {action === "approved"
              ? `Are you sure you want to approve the application from "${businessName}"? An acceptance email will be sent.`
              : `Are you sure you want to reject the application from "${businessName}"? A rejection email will be sent.`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {action === "rejected" && (
          <div className="space-y-2">
            <Label htmlFor="reason">Reason (optional)</Label>
            <Textarea
              id="reason"
              placeholder="Provide a reason for the rejection that will be included in the email..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={updateStatus.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant={action === "rejected" ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={updateStatus.isPending}
          >
            {updateStatus.isPending ? "Processing..." : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
