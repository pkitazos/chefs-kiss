import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AnimateIn } from "@/components/animate-in";
import { WavyPattern } from "@/components/brand-pattern";
import { HostedBy } from "@/components/hosted-by";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { PageLayout } from "@/components/page-layout";
import { buttonVariants } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";
import { COMING_SOON } from "@/lib/config/mode";
import {
  getWorkshopPriceSummary,
  type WorkshopConfig,
  WORKSHOPS,
} from "@/lib/config/workshops";
import { getWorkshopImage } from "@/lib/images/workshop-images";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Workshops | Chef's Kiss Festival",
  description:
    "Browse and book hands-on workshops at the Chef's Kiss Festival.",
};

export default function WorkshopsPage() {
  return (
    <>
      <div className="relative overflow-hidden bg-[#edede9]">
        <WavyPattern className="absolute inset-0 text-secondary/20" />
        {/* Decorative magenta cup accent */}
        <div
          aria-hidden
          className="absolute -left-12 bottom-0 size-48 rounded-t-full bg-primary/10"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <AnimateIn>
            <SectionLabel>Hands-on Culinary Experiences</SectionLabel>
            <h1 className="mt-3 font-display text-5xl tracking-tight">
              Workshops
            </h1>
            <p className="text-black mt-4 max-w-2xl text-lg">
              Learn from the best with our curated selection of interactive
              workshops. From pastry to cocktails, there&apos;s something for
              everyone.
            </p>
          </AnimateIn>
        </div>
      </div>

      <PageLayout className="max-w-6xl">
        <AnimateIn>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WORKSHOPS.map((workshop, i) => {
              const img = getWorkshopImage(workshop.slug);
              return (
                <AnimateIn
                  key={workshop.slug}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                    delay: i * 0.1,
                  }}
                >
                  <div className="flex h-full flex-col overflow-hidden rounded-lg border transition-colors hover:border-primary/30 hover:bg-muted/50">
                    <ImagePlaceholder className="aspect-video h-60 bg-pink-600/30">
                      {img && (
                        <Image
                          className="size-full object-cover"
                          src={img}
                          alt={""}
                          placeholder="blur"
                        />
                      )}
                    </ImagePlaceholder>
                    <div className="flex flex-1 flex-col gap-3 p-5">
                      <div>
                        <h2 className="text-lg font-display font-semibold">
                          {workshop.title}
                        </h2>
                        {workshop.hostedBy.length > 0 && (
                          <p className="-mt-1 mb-2.5 text-sm">
                            by <HostedBy hosts={workshop.hostedBy} />
                          </p>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {workshop.tagline}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        {!COMING_SOON && (
                          <div className="text-sm">
                            <WorkshopPriceSummary workshop={workshop} />
                          </div>
                        )}
                        <Link
                          href={`/workshops/${workshop.slug}`}
                          className={cn(
                            buttonVariants({ size: "cta-md" }),
                            "ml-auto",
                          )}
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </AnimateIn>
      </PageLayout>
    </>
  );
}

function WorkshopPriceSummary({ workshop }: { workshop: WorkshopConfig }) {
  const summary = getWorkshopPriceSummary(workshop);
  if (summary === null) {
    return (
      <span className="text-muted-foreground">
        TBC &middot; {workshop.duration}
      </span>
    );
  }

  return (
    <>
      <span className="font-semibold text-primary">
        {summary.varies ? "from " : ""}&euro;
        {summary.min}
      </span>
      <span className="text-muted-foreground">
        {" "}
        &middot; {workshop.duration}
      </span>
    </>
  );
}
