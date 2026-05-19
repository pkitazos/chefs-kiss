import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getDiningSessionById } from "@/lib/config/private-dining";
import { BOOKINGS_DISABLED } from "@/lib/config/mode";
import { PageLayout } from "@/components/page-layout";
import { PrivateDiningWaitlistForm } from "./waitlist-form";

export const metadata: Metadata = {
  title: "Join Waitlist",
  description: "Join the waitlist for a private dining session.",
};

export default async function PrivateDiningWaitlistPage({
  searchParams,
}: {
  searchParams: Promise<{ session?: string }>;
}) {
  const { session: sessionId } = await searchParams;

  if (BOOKINGS_DISABLED) {
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
      <PrivateDiningWaitlistForm
        sessionId={result.session.id}
        sessionTitle={result.session.title}
        sessionTime={result.session.time}
        sessionLocation={result.session.location}
        sessionDate={result.day.date.toISOString()}
        price={result.session.price}
      />
    </PageLayout>
  );
}
