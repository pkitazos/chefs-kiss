import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getWorkshopBySlug, WORKSHOPS } from "@/lib/config/workshops";
import { PageLayout } from "@/components/page-layout";
import { SectionLabel } from "@/components/ui/section-label";
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
        <div className="space-y-4">
          <SectionLabel>Workshop</SectionLabel>
          <h1 className="text-4xl font-bold tracking-tight">
            {workshop.title}
          </h1>
          <p className="text-muted-foreground text-lg">{workshop.tagline}</p>
          <div className="text-sm">
            <span className="font-semibold">&euro;{workshop.price}</span>
            <span className="text-muted-foreground">
              {" "}
              &middot; {workshop.duration}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
          <div className="aspect-4/3 rounded-2xl bg-muted" />
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">About this workshop</h2>
            <p className="text-muted-foreground">{workshop.longDescription}</p>
          </div>
        </div>

        <WorkshopSlots workshop={workshop} />

        <Link
          href="/workshops"
          className="text-primary block text-sm underline"
        >
          Back to Workshops
        </Link>
      </div>
    </PageLayout>
  );
}
