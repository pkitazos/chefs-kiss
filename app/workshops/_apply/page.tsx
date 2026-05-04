import type { Metadata } from "next";
import { WorkshopApplicationForm } from "./workshop-application-form";
import { CURRENT_EVENT } from "@/lib/config/event";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Workshop Application | Chef's Kiss Festival",
  description:
    "Apply to host a workshop at Chef's Kiss Festival. Submit your application with workshop details, session logistics, and contact information.",
};

export default function WorkshopApplicationPage() {
  const isOpen = new Date() < CURRENT_EVENT.workshopApplicationDeadline;

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
          {isOpen ? (
            <div className="border-l-4 border-primary bg-primary/5 p-4">
              <p className="text-sm">
                <strong>Important:</strong> All fields marked with an asterisk (
                <span className="text-accent text-sm font-medium">*</span>) are
                required. Please provide as much detail as possible to help us
                evaluate your application.
              </p>
            </div>
          ) : (
            <div className="border-l-4 border-destructive bg-destructive/5 p-4">
              <h2 className="text-xl font-semibold">
                Applications are now closed
              </h2>
              <p className="text-muted-foreground mt-2">
                The workshop application period has ended.
              </p>
            </div>
          )}
        </div>

        {isOpen && <WorkshopApplicationForm />}
      </div>
    </div>
  );
}
