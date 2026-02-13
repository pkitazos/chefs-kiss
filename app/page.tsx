import Link from "next/link";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { MainLogo } from "@/components/main-logo";

const subtitle = (location: string, date: string) => `${date} | ${location}`;

const NEXT_EVENT = {
  vendorApplicationDeadline: new Date("2026-02-28T23:59:59"),
  workshopApplicationDeadline: new Date("2026-02-28T23:59:59"),
  locationName: "Ayia Napa Marina, Famagusta",
  dates: "16 · 17 May 2026",
};

export const dynamic = "force-dynamic";

export default function HomePage() {
  const now = new Date();
  const isVendorAppOpen = NEXT_EVENT.vendorApplicationDeadline > now;
  const isWorkshopAppOpen = NEXT_EVENT.workshopApplicationDeadline > now;

  return (
    <main className="grid h-[92dvh] place-items-center pt-16 w-full relative px-2.5">
      <div className="flex flex-col items-center space-y-8 w-full justify-center h-full">
        <MainLogo className="mx-auto w-full max-w-80 sm:w-108 sm:max-w-full" />
        <p className="text-center text-xl font-bold tracking-tight sm:text-2xl">
          {subtitle(NEXT_EVENT.locationName, NEXT_EVENT.dates)}
        </p>
        <div className="flex flex-row gap-10 h-10 items-center">
          {isVendorAppOpen && (
            <Link
              href="/vendors/apply"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "px-9 py-6 text-lg hover:scale-110 transition-all duration-200 hover:bg-primary",
              )}
            >
              Apply to be a Vendor
            </Link>
          )}
          {isWorkshopAppOpen && (
            <Link
              href="/workshops/apply"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "px-9 py-6 text-lg hover:scale-110 transition-all duration-200 hover:bg-primary",
              )}
            >
              Apply to host a Workshop
            </Link>
          )}
        </div>
      </div>
      {/* check if different deadlines for each application */}
      {isWorkshopAppOpen && (
        <p className="absolute bottom-0 place-self-center text-center font-bold tracking-tight text-muted-foreground sm:text-lg px-2.5">
          <span className="text-primary">*</span> All applications are required
          to be completed and submitted by{" "}
          {format(NEXT_EVENT.workshopApplicationDeadline, "MMMM d, yyyy")}.
        </p>
      )}
    </main>
  );
}
