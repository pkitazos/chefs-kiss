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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/trpc/client";
import {
  IconDotsVertical,
  IconLockOpen,
  IconPencil,
} from "@tabler/icons-react";

interface HoldRowActionsProps {
  holdId: string;
  seatCount: number;
  note: string | null;
}

export function HoldRowActions({
  holdId,
  seatCount,
  note,
}: HoldRowActionsProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [releaseOpen, setReleaseOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-xs">
            <IconDotsVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <IconPencil />
            Edit note
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setReleaseOpen(true)}
          >
            <IconLockOpen />
            Release
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditNoteDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        holdId={holdId}
        initialNote={note ?? ""}
      />

      <ReleaseHoldDialog
        open={releaseOpen}
        onOpenChange={setReleaseOpen}
        holdId={holdId}
        seatCount={seatCount}
      />
    </>
  );
}

interface EditNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  holdId: string;
  initialNote: string;
}

function EditNoteDialog({
  open,
  onOpenChange,
  holdId,
  initialNote,
}: EditNoteDialogProps) {
  const utils = api.useUtils();
  const [note, setNote] = useState(initialNote);

  const handleOpenChange = (next: boolean) => {
    if (next) setNote(initialNote);
    onOpenChange(next);
  };

  const update = api.seatHolds.update.useMutation({
    onSuccess: () => {
      utils.slots.bySlot.invalidate();
      onOpenChange(false);
      toast.success("Note updated");
    },
    onError: (err) => {
      toast.error("Failed to update note", { description: err.message });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit hold note</AlertDialogTitle>
          <AlertDialogDescription>
            Admin-only — never sent to anyone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-1.5">
          <Label htmlFor="edit-hold-note" className="text-sm">
            Note
          </Label>
          <Textarea
            id="edit-hold-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={update.isPending}
            maxLength={500}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={update.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => update.mutate({ holdId, note: note.trim() })}
            disabled={update.isPending}
          >
            {update.isPending ? "Saving..." : "Save"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface ReleaseHoldDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  holdId: string;
  seatCount: number;
}

function ReleaseHoldDialog({
  open,
  onOpenChange,
  holdId,
  seatCount,
}: ReleaseHoldDialogProps) {
  const utils = api.useUtils();

  const release = api.seatHolds.release.useMutation({
    onSuccess: () => {
      utils.slots.bySlot.invalidate();
      utils.slots.summary.invalidate();
      onOpenChange(false);
      toast.success("Hold released — seats returned to public pool");
    },
    onError: (err) => {
      toast.error("Failed to release", { description: err.message });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Release hold</AlertDialogTitle>
          <AlertDialogDescription>
            Release {seatCount} seat{seatCount === 1 ? "" : "s"} back to the
            public available pool.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={release.isPending}>
            Back
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => release.mutate({ holdId })}
            disabled={release.isPending}
          >
            {release.isPending ? "Releasing..." : "Release"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
