import { notFound } from "next/navigation";
import { env } from "@/lib/env/server";
import { VendorApplicationForm } from "../vendor-application-form";

export default async function LateVendorApplicationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  if (!env.VENDOR_LATE_TOKEN || token !== env.VENDOR_LATE_TOKEN) {
    notFound();
  }

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
          <div className="border-l-4 border-amber-500 bg-amber-500/10 p-4">
            <p className="text-sm">
              <strong>Late submission:</strong> You are submitting a vendor
              application after the standard deadline via a private link. All
              fields marked with an asterisk (
              <span className="text-accent text-sm font-medium">*</span>) are
              required.
            </p>
          </div>
        </div>

        <VendorApplicationForm />
      </div>
    </div>
  );
}
