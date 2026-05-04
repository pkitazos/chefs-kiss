"use client";

import { IconCircleCheck, IconLoader2 } from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { PageLayout } from "@/components/page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionLabel } from "@/components/ui/section-label";
import { api } from "@/lib/trpc/client";

import { ClaimPayButton } from "./claim-pay-button";

const SUPPORT_EMAIL = "info@chefskiss.com.cy";

export default function WaitlistClaimPage() {
  return (
    <Suspense
      fallback={
        <PageLayout className="flex max-w-2xl items-center justify-center py-24">
          <IconLoader2 className="text-muted-foreground size-6 animate-spin" />
        </PageLayout>
      }
    >
      <WaitlistClaimContent />
    </Suspense>
  );
}

function WaitlistClaimContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data, isLoading } = api.waitlist.getClaimEntry.useQuery(
    { id: id! },
    { enabled: !!id },
  );

  if (!id) {
    return (
      <ClaimMessage
        title="Missing offer reference"
        body={
          <>
            We couldn&apos;t find that offer. Please check the link, or contact{" "}
            <SupportLink />.
          </>
        }
      />
    );
  }

  if (isLoading || !data) {
    return (
      <PageLayout className="flex max-w-2xl items-center justify-center py-24">
        <IconLoader2 className="text-muted-foreground size-6 animate-spin" />
      </PageLayout>
    );
  }

  if (data.state === "not-found") {
    return (
      <ClaimMessage
        title="Offer not found"
        body={
          <>
            We couldn&apos;t find that offer. Please check the link, or contact{" "}
            <SupportLink />.
          </>
        }
      />
    );
  }

  if (data.state === "no-longer-available") {
    return (
      <ClaimMessage
        title="Offer no longer available"
        body={
          <>
            This offer is no longer available. If you believe this is an error,
            contact <SupportLink />.
          </>
        }
      />
    );
  }

  if (data.state === "already-paid") {
    return (
      <PageLayout className="max-w-2xl">
        <div className="mb-6 space-y-2">
          <SectionLabel>Waitlist</SectionLabel>
          <h1 className="font-display text-3xl tracking-tight">
            Booking confirmed
          </h1>
        </div>

        <Card>
          <CardContent>
            <div className="flex items-start gap-3 rounded-md bg-primary/5 p-3">
              <IconCircleCheck className="text-primary mt-0.5 size-5 shrink-0" />
              <p className="text-sm">
                You&apos;re all set! Your booking for {data.slot.label} is
                confirmed. A confirmation email was sent to {data.booking.email}
                .
              </p>
            </div>
          </CardContent>
        </Card>
      </PageLayout>
    );
  }

  // ready-to-pay
  return (
    <PageLayout className="max-w-2xl">
      <div className="mb-6 space-y-2">
        <SectionLabel>Waitlist</SectionLabel>
        <h1 className="font-display text-3xl tracking-tight">
          A spot opened up
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{data.slot.label}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground space-y-1.5 text-sm">
            <p>
              <span>Party size:</span>{" "}
              <span className="text-foreground font-medium">
                {data.slot.seats} {data.slot.seats === 1 ? "person" : "people"}
              </span>
            </p>
            <p>
              <span>Total:</span>{" "}
              <span className="text-foreground font-medium">
                {data.slot.totalFormatted}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 space-y-4">
        <p className="text-muted-foreground text-sm">
          Clicking will redirect you to our secure payment provider. Your spot
          is held until you complete payment.
        </p>
        <ClaimPayButton entryId={data.entry.id} />
      </div>
    </PageLayout>
  );
}

function ClaimMessage({
  title,
  body,
}: {
  title: string;
  body: React.ReactNode;
}) {
  return (
    <PageLayout className="max-w-2xl">
      <div className="mb-6 space-y-2">
        <SectionLabel>Waitlist</SectionLabel>
        <h1 className="font-display text-3xl tracking-tight">{title}</h1>
      </div>

      <Card>
        <CardContent>
          <p className="text-sm">{body}</p>
        </CardContent>
      </Card>
    </PageLayout>
  );
}

function SupportLink() {
  return (
    <a
      href={`mailto:${SUPPORT_EMAIL}`}
      className="underline underline-offset-2"
    >
      {SUPPORT_EMAIL}
    </a>
  );
}
