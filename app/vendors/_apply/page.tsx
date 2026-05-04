import type { Metadata } from "next";
import { VendorApplicationForm } from "./vendor-application-form";
import { CURRENT_EVENT } from "@/lib/config/event";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vendor Application | Chef's Kiss Festival",
  description:
    "Apply to become a vendor at Chef's Kiss Festival. Submit your application with business information, menu details, and required documents.",
};

export default function VendorApplicationPage() {
  const isOpen = new Date() < CURRENT_EVENT.vendorApplicationDeadline;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Vendor Application
          </h1>
          <p className="text-muted-foreground text-lg">
            Join Chef&apos;s Kiss Festival as a food vendor. Complete the
            application below with your business information, menu offerings,
            and all required documentation.
          </p>
          {isOpen ? (
            <div className="border-l-4 border-primary bg-primary/5 p-4">
              <p className="text-sm">
                <strong>Important:</strong> All fields marked with an asterisk (
                <span className="text-accent text-sm font-medium">*</span>) are
                required. Please ensure all documents are in PDF format and all
                images are clear and legible.
              </p>
            </div>
          ) : (
            <div className="border-l-4 border-destructive bg-destructive/5 p-4">
              <h2 className="text-xl font-semibold">
                Applications are now closed
              </h2>
              <p className="text-muted-foreground mt-2">
                The vendor application period has ended.
              </p>
            </div>
          )}
        </div>

        {isOpen && <VendorApplicationForm />}
      </div>
    </div>
  );
}
