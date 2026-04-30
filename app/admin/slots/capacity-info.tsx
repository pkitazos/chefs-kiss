"use client";

import { IconInfoCircle } from "@tabler/icons-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function CapacityInfoIcon() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label="Capacity breakdown explainer"
          className="text-muted-foreground hover:text-foreground"
        >
          <IconInfoCircle className="size-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <div className="space-y-1">
          <div>
            <strong>Filled</strong> = total seats committed against capacity.
          </div>
          <div className="text-muted-foreground">
            <strong>b</strong> booked (confirmed) · <strong>r</strong> reserved
            (pending payment) · <strong>h</strong> held (admin reservation)
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
