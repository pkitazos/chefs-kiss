"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { api } from "@/lib/trpc/client";
import { IconPencil } from "@tabler/icons-react";

interface EditableNameCellProps {
  bookingId: string;
  fullName: string;
}

export function EditableNameCell({
  bookingId,
  fullName,
}: EditableNameCellProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(fullName);
  const inputRef = useRef<HTMLInputElement>(null);
  const utils = api.useUtils();

  const updateName = api.bookings.updateName.useMutation({
    onSuccess: () => {
      utils.slots.bySlot.invalidate();
      utils.bookings.adminList.invalidate();
      setEditing(false);
    },
    onError: (err) => {
      toast.error("Failed to update name", { description: err.message });
      setValue(fullName);
      setEditing(false);
    },
  });

  const save = () => {
    const trimmed = value.trim();
    if (!trimmed || trimmed === fullName) {
      setValue(fullName);
      setEditing(false);
      return;
    }
    updateName.mutate({ bookingId, fullName: trimmed });
  };

  if (editing) {
    return (
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") {
            setValue(fullName);
            setEditing(false);
          }
        }}
        disabled={updateName.isPending}
        className="h-7 text-sm"
        autoFocus
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className="group inline-flex items-center gap-1 text-left hover:underline cursor-pointer"
    >
      {fullName}
      <IconPencil className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
