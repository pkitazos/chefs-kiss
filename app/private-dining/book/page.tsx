import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getDiningSessionById } from "@/lib/config/event";
import { COMING_SOON } from "@/lib/config/mode";
import { PageLayout } from "@/components/page-layout";
import { PrivateDiningBookingForm } from "./booking-form";

export const metadata: Metadata = {
  title: "Book Private Dining | Chef's Kiss Festival",
  description: "Reserve your seat at a private dining session.",
};

export default async function PrivateDiningBookPage({
  searchParams,
}: {
  searchParams: Promise<{ session?: string }>;
}) {
  const { session: sessionId } = await searchParams;

  if (COMING_SOON) {
    redirect("/private-dining");
  }

  if (!sessionId) {
    redirect("/private-dining");
  }

  const result = getDiningSessionById(sessionId);

  if (!result) {
    redirect("/private-dining");
  }

  return (
    <PageLayout className="max-w-2xl">
      <PrivateDiningBookingForm
        sessionId={result.session.id}
        sessionTitle={result.session.title}
        sessionTime={result.session.time}
        sessionLocation={result.session.location}
        sessionDate={result.day.date.toISOString()}
        price={result.session.price}
        capacity={result.session.capacity}
      />
    </PageLayout>
  );
}
