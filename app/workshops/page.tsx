import type { Metadata } from "next";
import Link from "next/link";
import { WORKSHOPS } from "@/lib/config/workshops";
import { PageLayout } from "@/components/page-layout";
import { SectionLabel } from "@/components/ui/section-label";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Workshops | Chef's Kiss Festival",
  description:
    "Browse and book hands-on workshops at the Chef's Kiss Festival.",
};

export default function WorkshopsPage() {
  return (
    <PageLayout>
      <div className="mb-12 space-y-4">
        <div className="mb-12">
          <h1 className="text-5xl font-bold tracking-tight">Workshops</h1>
          <SectionLabel>Hands-on Culinary Experiences</SectionLabel>
        </div>

        <p className="text-muted-foreground max-w-2xl text-lg">
          Learn from the best with our curated selection of interactive
          workshops. From pastry to cocktails, there&apos;s something for
          everyone.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {WORKSHOPS.map((workshop) => (
          <div
            key={workshop.slug}
            className="flex flex-col overflow-hidden rounded-lg border"
          >
            <div className="aspect-video bg-muted" />
            <div className="flex flex-1 flex-col gap-3 p-5">
              <div>
                <h2 className="text-lg font-semibold">{workshop.title}</h2>
                <p className="text-muted-foreground text-sm">
                  {workshop.tagline}
                </p>
              </div>
              <p className="text-muted-foreground text-sm">
                {workshop.shortDescription}
              </p>
              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="text-sm">
                  <span className="font-semibold">&euro;{workshop.price}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    &middot; {workshop.duration}
                  </span>
                </div>
                <Link
                  href={`/workshops/${workshop.slug}`}
                  className={cn(buttonVariants({ size: "lg" }))}
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
