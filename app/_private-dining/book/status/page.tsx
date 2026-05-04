"use client";

import {
  IconAlertCircle,
  IconCircleCheck,
  IconClock,
  IconLoader2,
} from "@tabler/icons-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { PageLayout } from "@/components/page-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionLabel } from "@/components/ui/section-label";
import { api } from "@/lib/trpc/client";

export default function PrivateDiningStatusPage() {
  return (
    <Suspense
      fallback={
        <PageLayout className="flex max-w-2xl items-center justify-center py-24">
          <IconLoader2 className="text-muted-foreground size-6 animate-spin" />
        </PageLayout>
      }
    >
      <PrivateDiningStatusContent />
    </Suspense>
  );
}

function PrivateDiningStatusContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("ref");

  const { data: booking, isLoading } = api.bookings.getStatus.useQuery(
    { bookingId: bookingId! },
    { enabled: !!bookingId, refetchInterval: 10_000 },
  );

  if (!bookingId) {
    return (
      <PageLayout className="max-w-2xl">
        <p className="text-muted-foreground">No booking reference provided.</p>
        <Link
          href="/private-dining"
          className="text-primary mt-2 block text-sm underline"
        >
          Back to Private Dining
        </Link>
      </PageLayout>
    );
  }

  if (isLoading) {
    return (
      <PageLayout className="flex max-w-2xl items-center justify-center py-24">
        <IconLoader2 className="text-muted-foreground size-6 animate-spin" />
      </PageLayout>
    );
  }

  if (!booking) {
    return (
      <PageLayout className="max-w-2xl">
        <p className="text-muted-foreground">Booking not found.</p>
        <Link
          href="/private-dining"
          className="text-primary mt-2 block text-sm underline"
        >
          Back to Private Dining
        </Link>
      </PageLayout>
    );
  }

  return (
    <PageLayout className="max-w-2xl">
      <div className="mb-6 space-y-2">
        <SectionLabel>Private Dining</SectionLabel>
        <h1 className="text-3xl font-bold tracking-tight">Booking Status</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Booking {booking.id}</CardTitle>
            <StatusBadge status={booking.status} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <StatusMessage status={booking.status} />

            <div className="text-sm space-y-1.5">
              <p>
                <span className="text-muted-foreground">Name:</span>{" "}
                {booking.fullName}
              </p>
              <p>
                <span className="text-muted-foreground">Email:</span>{" "}
                {booking.email}
              </p>
              <p>
                <span className="text-muted-foreground">Seats:</span>{" "}
                {booking.seats}
              </p>
              <p>
                <span className="text-muted-foreground">Total:</span> &euro;
                {(booking.totalAmount / 100).toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Link
        href="/private-dining"
        className="text-primary mt-6 block text-sm underline"
      >
        Back to Private Dining
      </Link>
    </PageLayout>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "confirmed":
      return <Badge>Confirmed</Badge>;
    case "pending":
      return <Badge variant="outline">Pending</Badge>;
    case "failed":
      return <Badge variant="destructive">Failed</Badge>;
    case "expired":
      return <Badge variant="secondary">Expired</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function StatusMessage({ status }: { status: string }) {
  switch (status) {
    case "confirmed":
      return (
        <div className="flex items-start gap-3 rounded-md bg-primary/5 p-3">
          <IconCircleCheck className="text-primary mt-0.5 size-5 shrink-0" />
          <p className="text-sm">
            Your booking is confirmed! A confirmation email has been sent.
          </p>
        </div>
      );
    case "pending":
      return (
        <div className="flex items-start gap-3 rounded-md bg-amber-500/10 p-3">
          <IconClock className="text-amber-500 mt-0.5 size-5 shrink-0" />
          <p className="text-sm">
            Your booking is awaiting payment. Please complete payment within 15
            minutes.
          </p>
        </div>
      );
    case "expired":
      return (
        <div className="flex items-start gap-3 rounded-md bg-muted p-3">
          <IconAlertCircle className="text-muted-foreground mt-0.5 size-5 shrink-0" />
          <p className="text-sm">
            This booking has expired. Please create a new reservation.
          </p>
        </div>
      );
    case "failed":
      return (
        <div className="flex items-start gap-3 rounded-md bg-destructive/10 p-3">
          <IconAlertCircle className="text-destructive mt-0.5 size-5 shrink-0" />
          <p className="text-sm">
            Payment failed. Please try again or contact support.
          </p>
        </div>
      );
    default:
      return null;
  }
}
