"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  IconCheck,
  IconCopy,
  IconDotsVertical,
  IconX,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { copyToClipboard } from "@/lib/utils";
import { StatusUpdateDialog } from "./status-update-dialog";

interface ApplicationActionsProps {
  applicationId: string;
  email: string;
  contactPerson: string;
  workshopTitle: string;
  currentStatus: "pending" | "approved" | "rejected";
}

export function ApplicationActions({
  applicationId,
  email,
  contactPerson,
  workshopTitle,
  currentStatus,
}: ApplicationActionsProps) {
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: "approved" | "rejected" | null;
  }>({ open: false, action: null });

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
            onClick={() => setConfirmDialog({ open: true, action: "approved" })}
            disabled={currentStatus === "approved"}
            variant="success"
          >
            <IconCheck />
            Accept
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setConfirmDialog({ open: true, action: "rejected" })}
            variant="destructive"
            disabled={currentStatus === "rejected"}
          >
            <IconX />
            Reject
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleCopyEmail}>
            <IconCopy />
            Copy Email
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <StatusUpdateDialog
        open={confirmDialog.open}
        action={confirmDialog.action}
        applicationId={applicationId}
        contactPerson={contactPerson}
        workshopTitle={workshopTitle}
        email={email}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
      />
    </>
  );
}
