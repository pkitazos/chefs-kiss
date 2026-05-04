"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ConfirmActionDialog } from "@/components/confirm-action-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/trpc/client";
import {
  MAX_SEAT_HOLD_COUNT,
  MIN_SEAT_HOLD_COUNT,
} from "@/lib/validations/seat-hold";
import { IconPlus } from "@tabler/icons-react";

import { HoldRowActions } from "./hold-row-actions";

type HoldRow = {
  id: string;
  slotId: string;
  seatCount: number;
  note: string | null;
  createdAt: Date;
  createdBy: string;
  creatorName: string | null;
  creatorEmail: string | null;
};

interface HoldsSectionProps {
  slotId: string;
  holds: HoldRow[];
  available: number;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function creatorLabel(hold: HoldRow): string {
  return hold.creatorName ?? hold.creatorEmail ?? hold.createdBy;
}

export function HoldsSection({ slotId, holds, available }: HoldsSectionProps) {
  const [createOpen, setCreateOpen] = useState(false);

  const totalHeldSeats = holds.reduce((sum, h) => sum + h.seatCount, 0);

  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">Held seats</h2>
        <div className="flex items-center gap-3">
          <p className="text-xs text-muted-foreground">
            {holds.length} active hold{holds.length === 1 ? "" : "s"} ·{" "}
            {totalHeldSeats} total seat{totalHeldSeats === 1 ? "" : "s"} held
          </p>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <IconPlus className="size-4" />
            Hold seats
          </Button>
        </div>
      </div>

      {holds.length > 0 ? (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Seats</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Created by</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {holds.map((hold) => (
                <TableRow key={hold.id}>
                  <TableCell className="font-medium">
                    {hold.seatCount}
                  </TableCell>
                  <TableCell className="max-w-md text-sm whitespace-pre-wrap">
                    {hold.note ?? (
                      <span className="text-muted-foreground italic">
                        No note
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {creatorLabel(hold)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {formatDate(hold.createdAt)}
                  </TableCell>
                  <TableCell>
                    <HoldRowActions
                      holdId={hold.id}
                      seatCount={hold.seatCount}
                      note={hold.note}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-lg border bg-muted/30 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No active holds for this slot.
          </p>
        </div>
      )}

      <CreateHoldDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        slotId={slotId}
        available={available}
      />
    </section>
  );
}

interface CreateHoldDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slotId: string;
  available: number;
}

function CreateHoldDialog({
  open,
  onOpenChange,
  slotId,
  available,
}: CreateHoldDialogProps) {
  const utils = api.useUtils();
  const [seatCount, setSeatCount] = useState("1");
  const [note, setNote] = useState("");

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setSeatCount("1");
      setNote("");
    }
    onOpenChange(next);
  };

  const create = api.seatHolds.hold.useMutation({
    onSuccess: () => {
      utils.slots.bySlot.invalidate();
      utils.slots.summary.invalidate();
      onOpenChange(false);
      toast.success("Seats held");
    },
    onError: (err) => {
      toast.error("Failed to hold seats", { description: err.message });
    },
  });

  const parsedCount = Number(seatCount);
  const validCount =
    Number.isInteger(parsedCount) &&
    parsedCount >= MIN_SEAT_HOLD_COUNT &&
    parsedCount <= MAX_SEAT_HOLD_COUNT;
  const overBy = validCount ? Math.max(0, parsedCount - available) : 0;
  const willOverfill = overBy > 0;

  return (
    <ConfirmActionDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Hold seats"
      description="Reserve seats against this slot for an admin allocation (VIP, press, walk-up, etc.). Held seats are removed from the public available pool until you release them."
      confirmLabel="Hold seats"
      pendingLabel="Holding..."
      isPending={create.isPending}
      confirmDisabled={!validCount}
      onConfirm={() =>
        create.mutate({
          slotId,
          seatCount: parsedCount,
          note: note.trim() || undefined,
        })
      }
    >
      <div className="space-y-1.5">
        <Label htmlFor="hold-seat-count" className="text-sm">
          Seats
        </Label>
        <Input
          id="hold-seat-count"
          type="number"
          inputMode="numeric"
          min={MIN_SEAT_HOLD_COUNT}
          max={MAX_SEAT_HOLD_COUNT}
          value={seatCount}
          onChange={(e) => setSeatCount(e.target.value)}
          disabled={create.isPending}
        />
        <p className="text-xs text-muted-foreground">
          {available} currently available.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="hold-note" className="text-sm">
          Internal note (optional)
        </Label>
        <Textarea
          id="hold-note"
          placeholder="e.g. Press allocation, Sponsor"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          disabled={create.isPending}
          maxLength={500}
        />
        <p className="text-xs text-muted-foreground">
          Admin-only / never sent to anyone.
        </p>
      </div>

      {willOverfill && (
        <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          This will put the slot <strong>{overBy} over capacity.</strong>{" "}
          Proceed only if you&apos;ve confirmed the extra seats can be
          accommodated.
        </div>
      )}
    </ConfirmActionDialog>
  );
}
