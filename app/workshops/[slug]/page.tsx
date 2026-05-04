import { IconArrowLeft } from "@tabler/icons-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AnimateIn } from "@/components/animate-in";
import { HostedBy } from "@/components/hosted-by";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { PageLayout } from "@/components/page-layout";
import { SectionLabel } from "@/components/ui/section-label";
import { COMING_SOON } from "@/lib/config/mode";
import { getWorkshopBySlug, WORKSHOPS } from "@/lib/config/workshops";
import { getWorkshopImage } from "@/lib/images/workshop-images";
import { WorkshopSlots } from "./workshop-slots";

export function generateStaticParams() {
  return WORKSHOPS.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const workshop = getWorkshopBySlug(slug);
  if (!workshop) return {};

  return {
    title: `${workshop.title} | Chef's Kiss Festival`,
    description: workshop.tagline,
  };
}

export default async function WorkshopPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const workshop = getWorkshopBySlug(slug);

  if (!workshop) {
    notFound();
  }

  const img = getWorkshopImage(workshop.slug);

  return (
    <PageLayout>
      <div className="space-y-8">
        <Link
          href="/workshops"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <IconArrowLeft size={15} />
          <span>Workshops</span>
        </Link>

        <AnimateIn className="space-y-4">
          <SectionLabel>Workshop</SectionLabel>
          <h1 className="font-display text-4xl tracking-tight">
            {workshop.title}
          </h1>
          {workshop.hostedBy.length > 0 && (
            <p className="-mt-2 text-muted-foreground text-lg">
              by <HostedBy hosts={workshop.hostedBy} />
            </p>
          )}
        </AnimateIn>

        <AnimateIn>
          <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
            <ImagePlaceholder className="aspect-4/3 bg-pink-600/30 rounded-md">
              {img && (
                <Image
                  className="size-full object-cover rounded-md"
                  src={img}
                  alt={""}
                  placeholder="blur"
                />
              )}
            </ImagePlaceholder>
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">About this workshop</h2>
              <p className="text-muted-foreground">
                {workshop.longDescription}
              </p>
            </div>
          </div>
        </AnimateIn>

        <AnimateIn>
          {COMING_SOON ? (
            <div className="rounded-2xl border border-dashed bg-muted/30 p-8 text-center">
              <SectionLabel>Coming Soon</SectionLabel>
              <h2 className="mt-3 font-display text-3xl tracking-tight">
                Sessions coming soon
              </h2>
              <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                We&apos;re finalising the workshop schedule. Check back soon to
                book your spot.
              </p>
            </div>
          ) : (
            <WorkshopSlots workshop={workshop} />
          )}
        </AnimateIn>
      </div>
    </PageLayout>
  );
}
