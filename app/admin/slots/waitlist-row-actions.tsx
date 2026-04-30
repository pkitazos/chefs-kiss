"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { copyToClipboard } from "@/lib/utils";
import {
  IconCheck,
  IconCopy,
  IconDotsVertical,
  IconX,
} from "@tabler/icons-react";

import { WaitlistActionDialog } from "./waitlist-action-dialog";

interface WaitlistRowActionsProps {
  entryId: string;
  email: string;
  fullName: string;
  partySize: number;
  available: number;
  status: "waiting" | "promoted" | "cancelled";
}

export function WaitlistRowActions({
  entryId,
  email,
  fullName,
  partySize,
  available,
  status,
}: WaitlistRowActionsProps) {
  const [dialog, setDialog] = useState<{
    open: boolean;
    action: "promote" | "remove" | null;
  }>({ open: false, action: null });

  const disabled = status !== "waiting";

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
            onClick={() => setDialog({ open: true, action: "promote" })}
            disabled={disabled}
            variant="success"
          >
            <IconCheck />
            Promote
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDialog({ open: true, action: "remove" })}
            disabled={disabled}
            variant="destructive"
          >
            <IconX />
            Remove
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleCopyEmail}>
            <IconCopy />
            Copy Email
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <WaitlistActionDialog
        open={dialog.open}
        action={dialog.action}
        entryId={entryId}
        email={email}
        fullName={fullName}
        partySize={partySize}
        available={available}
        onOpenChange={(open) => setDialog({ ...dialog, open })}
      />
    </>
  );
}
