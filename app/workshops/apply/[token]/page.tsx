import { notFound } from "next/navigation";
import { env } from "@/lib/env/server";
import { WorkshopApplicationForm } from "../workshop-application-form";

export default async function LateWorkshopApplicationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  if (!env.WORKSHOP_LATE_TOKEN || token !== env.WORKSHOP_LATE_TOKEN) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Workshop Application
          </h1>
          <p className="text-muted-foreground text-lg">
            Apply to host a workshop at Chef&apos;s Kiss Food Festival. Tell us
            about your workshop, session details, and how we can reach you.
          </p>
          <div className="border-l-4 border-amber-500 bg-amber-500/10 p-4">
            <p className="text-sm">
              <strong>Late submission:</strong> You are submitting a workshop
              application after the standard deadline via a private link. All
              fields marked with an asterisk (
              <span className="text-accent text-sm font-medium">*</span>) are
              required.
            </p>
          </div>
        </div>

        <WorkshopApplicationForm />
      </div>
    </div>
  );
}
