"use client";

import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  IconCircleCheck,
  IconClock,
  IconAlertCircle,
  IconLoader2,
} from "@tabler/icons-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageLayout } from "@/components/page-layout";
import { SectionLabel } from "@/components/ui/section-label";
import { api } from "@/lib/trpc/client";

export default function WorkshopStatusPage() {
  const searchParams = useSearchParams();
  const params = useParams<{ slug: string }>();
  const bookingId = searchParams.get("ref");
  const utils = api.useUtils();

  const { data: booking, isLoading } = api.bookings.getStatus.useQuery(
    { bookingId: bookingId! },
    { enabled: !!bookingId, refetchInterval: 10_000 },
  );

  const simulatePayment = api.bookings.simulatePayment.useMutation({
    onSuccess: () => {
      toast.success("Payment simulated successfully!");
      utils.bookings.getStatus.invalidate({ bookingId: bookingId! });
    },
    onError: (error) => {
      toast.error("Payment simulation failed", {
        description: error.message,
      });
    },
  });

  const backLink = `/workshops/${params.slug}`;

  if (!bookingId) {
    return (
      <PageLayout className="max-w-2xl">
        <p className="text-muted-foreground">
          No booking reference provided.
        </p>
        <Link href={backLink} className="text-primary mt-2 block text-sm underline">
          Back to Workshop
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
        <Link href={backLink} className="text-primary mt-2 block text-sm underline">
          Back to Workshop
        </Link>
      </PageLayout>
    );
  }

  return (
    <PageLayout className="max-w-2xl">
      <div className="mb-6 space-y-2">
        <SectionLabel>Workshop</SectionLabel>
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

            <div className="space-y-1.5 text-sm">
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
              {booking.paymentReference && (
                <p>
                  <span className="text-muted-foreground">Payment Ref:</span>{" "}
                  {booking.paymentReference}
                </p>
              )}
            </div>

            {booking.status === "pending" && (
              <div className="border-t pt-4">
                <p className="text-muted-foreground mb-3 text-xs">
                  Payment integration is not yet live. Use the button below to
                  simulate a successful payment.
                </p>
                <Button
                  size="lg"
                  onClick={() =>
                    simulatePayment.mutate({ bookingId: booking.id })
                  }
                  disabled={simulatePayment.isPending}
                >
                  {simulatePayment.isPending ? (
                    <>
                      <IconLoader2 className="animate-spin" />
                      Processing…
                    </>
                  ) : (
                    "Simulate Payment"
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Link
        href={backLink}
        className="text-primary mt-6 block text-sm underline"
      >
        Back to Workshop
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
        <div className="flex items-start gap-3 rounded-md bg-emerald-50 p-3 dark:bg-emerald-950/30">
          <IconCircleCheck className="mt-0.5 size-5 shrink-0 text-emerald-600" />
          <p className="text-sm">
            Your booking is confirmed! A confirmation email has been sent.
          </p>
        </div>
      );
    case "pending":
      return (
        <div className="flex items-start gap-3 rounded-md bg-amber-50 p-3 dark:bg-amber-950/30">
          <IconClock className="mt-0.5 size-5 shrink-0 text-amber-600" />
          <p className="text-sm">
            Your booking is awaiting payment. Please complete payment within 15
            minutes.
          </p>
        </div>
      );
    case "expired":
      return (
        <div className="flex items-start gap-3 rounded-md bg-gray-50 p-3 dark:bg-gray-900/30">
          <IconAlertCircle className="text-muted-foreground mt-0.5 size-5 shrink-0" />
          <p className="text-sm">
            This booking has expired. Please create a new booking.
          </p>
        </div>
      );
    case "failed":
      return (
        <div className="flex items-start gap-3 rounded-md bg-rose-50 p-3 dark:bg-rose-950/30">
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
