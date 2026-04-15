import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";
import { getWorkshopBySlug, WORKSHOPS } from "@/lib/config/workshops";
import { PageLayout } from "@/components/page-layout";
import { SectionLabel } from "@/components/ui/section-label";
import { AnimateIn } from "@/components/animate-in";
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
    description: workshop.shortDescription,
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
          <p className="text-muted-foreground text-lg">
            by {workshop.hostedBy}
          </p>
          <p className="text-muted-foreground text-lg">{workshop.tagline}</p>
          <div className="text-sm">
            <span className="font-semibold text-primary">
              &euro;{workshop.price}
            </span>
            <span className="text-muted-foreground">
              {" "}
              &middot; {workshop.duration}
            </span>
          </div>
        </AnimateIn>

        <AnimateIn>
          <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
            <div className="aspect-4/3 rounded-2xl bg-muted" />
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">About this workshop</h2>
              <p className="text-muted-foreground">
                {workshop.longDescription}
              </p>
            </div>
          </div>
        </AnimateIn>

        <AnimateIn>
          <WorkshopSlots workshop={workshop} />
        </AnimateIn>

      </div>
    </PageLayout>
  );
}
