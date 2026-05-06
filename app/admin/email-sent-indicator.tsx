"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDate } from "@/lib/utils/format-date";
import { IconCheck, IconX, IconMinus } from "@tabler/icons-react";

import type { Booking } from "@/lib/db/schema";

export function EmailSentIndicator({
  status,
  confirmationEmailSentAt,
}: Pick<Booking, "status" | "confirmationEmailSentAt">) {
  if (status === "confirmed" && confirmationEmailSentAt) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <IconCheck className="size-4 text-green-600" />
        </TooltipTrigger>
        <TooltipContent>
          Sent: {formatDate(confirmationEmailSentAt)}
        </TooltipContent>
      </Tooltip>
    );
  }

  if (status === "confirmed") {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <IconX className="size-4 text-red-500" />
        </TooltipTrigger>
        <TooltipContent>Never sent</TooltipContent>
      </Tooltip>
    );
  }

  return <IconMinus className="size-4 text-muted-foreground" />;
}
