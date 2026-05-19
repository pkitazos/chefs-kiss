import Image from "next/image";
import Link from "next/link";
import { IconClock } from "@tabler/icons-react";

import { HostedBy } from "@/components/hosted-by";
import { BOOKINGS_DISABLED } from "@/lib/config/mode";
import type { WorkshopConfig, WorkshopSlug } from "@/lib/config/workshops";
import { getWorkshopImage } from "@/lib/images/workshop-images";
import { cn } from "@/lib/utils";

export type WorkshopCarouselCardVariant = "overlay" | "minimal" | "detailed";

interface Props {
  workshop: WorkshopConfig;
  variant: WorkshopCarouselCardVariant;
  className?: string;
}

export function WorkshopCarouselCard({ workshop, variant, className }: Props) {
  switch (variant) {
    case "overlay":
      return <OverlayCard workshop={workshop} className={className} />;
    case "minimal":
      return <MinimalCard workshop={workshop} className={className} />;
    case "detailed":
      return <DetailedCard workshop={workshop} className={className} />;
  }
}

function OverlayCard({
  workshop,
  className,
}: {
  workshop: WorkshopConfig;
  className?: string;
}) {
  const img = getWorkshopImage(workshop.slug as WorkshopSlug);

  return (
    <Link
      href={`/workshops/${workshop.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl",
        className,
      )}
    >
      <div className="aspect-3/4 w-full overflow-hidden">
        {img ? (
          <Image
            src={img}
            alt={workshop.title}
            placeholder="blur"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="size-full bg-muted" />
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-5 pt-20 bg-linear-to-t from-black/80 via-black/40 to-transparent">
        <p className="font-display text-xl tracking-tight text-white sm:text-2xl">
          {workshop.title}
        </p>
        {workshop.hostedBy.length > 0 && (
          <p className="mt-0.5 text-sm text-white/70">
            by <HostedBy hosts={workshop.hostedBy} />
          </p>
        )}
        <p className="mt-1.5 text-sm text-white/60 line-clamp-2">
          {workshop.tagline}
        </p>
        {!BOOKINGS_DISABLED && (
          <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-white/80">
            <IconClock size={14} />
            {workshop.duration}
          </span>
        )}
      </div>
    </Link>
  );
}

function MinimalCard({
  workshop,
  className,
}: {
  workshop: WorkshopConfig;
  className?: string;
}) {
  const img = getWorkshopImage(workshop.slug as WorkshopSlug);

  return (
    <Link
      href={`/workshops/${workshop.slug}`}
      className={cn("group flex flex-col gap-3", className)}
    >
      <div className="aspect-square w-full overflow-hidden rounded-xl">
        {img ? (
          <Image
            src={img}
            alt={workshop.title}
            placeholder="blur"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="size-full bg-muted rounded-xl" />
        )}
      </div>

      <div className="flex flex-col gap-1 px-0.5">
        <p className="font-display text-lg tracking-tight sm:text-xl">
          {workshop.title}
        </p>
        <p className="text-sm text-muted-foreground">
          {workshop.hostedBy.length > 0 && (
            <>
              <HostedBy hosts={workshop.hostedBy} />
              {!BOOKINGS_DISABLED && " · "}
            </>
          )}
          {!BOOKINGS_DISABLED && workshop.duration}
        </p>
      </div>
    </Link>
  );
}

function DetailedCard({
  workshop,
  className,
}: {
  workshop: WorkshopConfig;
  className?: string;
}) {
  const img = getWorkshopImage(workshop.slug as WorkshopSlug);

  return (
    <Link
      href={`/workshops/${workshop.slug}`}
      className={cn("group flex flex-col gap-3", className)}
    >
      <div className="aspect-square w-full overflow-hidden rounded-xl">
        {img ? (
          <Image
            src={img}
            alt={workshop.title}
            placeholder="blur"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="size-full bg-muted rounded-xl" />
        )}
      </div>

      <div className="flex flex-col gap-1.5 px-0.5">
        <p className="font-display text-lg tracking-tight sm:text-xl">
          {workshop.title}
        </p>
        <div className="flex flex-wrap gap-2">
          {workshop.hostedBy.length > 0 && (
            <p className="text-sm text-muted-foreground">
              by <HostedBy hosts={workshop.hostedBy} />
            </p>
          )}
          {!BOOKINGS_DISABLED && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
              <IconClock size={14} />
              {workshop.duration}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {workshop.tagline}
        </p>
      </div>
    </Link>
  );
}
