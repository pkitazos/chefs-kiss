"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/trpc/client";
import Link from "next/link";
import {
  IconLoader2,
  IconCalendar,
  IconMapPin,
  IconUsers,
  IconTicket,
  IconClockPause,
  IconArrowRight,
} from "@tabler/icons-react";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(
    new Date(date),
  );
}

function formatDateRange(start: Date, end: Date) {
  return `${formatDate(start)} - ${formatDate(end)}`;
}

export default function AdminPage() {
  const { data: activeEventData, isLoading: eventLoading } =
    api.events.getActiveEventStats.useQuery();
  const { data: allBookings, isLoading: bookingsLoading } =
    api.bookings.adminList.useQuery({});
  const { data: slotSummary, isLoading: slotsLoading } =
    api.slots.summary.useQuery();

  const isLoading = eventLoading || bookingsLoading || slotsLoading;

  const totalWaiting = (slotSummary ?? []).reduce(
    (sum, s) => sum + s.waitlist,
    0,
  );
  const slotsWithWaitlist = (slotSummary ?? []).filter(
    (s) => s.waitlist > 0,
  ).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <IconLoader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const {
    event: activeEvent,
    vendorStats,
    workshopStats,
  } = activeEventData ?? {};

  if (!activeEvent) {
    return (
      <div className="space-y-6 py-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              No active event. Create an event to start accepting applications.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalBookings = allBookings?.length ?? 0;
  const pendingBookings =
    allBookings?.filter((b) => b.status === "pending").length ?? 0;

  return (
    <div className="space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {activeEvent.name}
          </span>
          <span className="flex items-center gap-1">
            <IconCalendar className="size-4" />
            {formatDateRange(activeEvent.startDate, activeEvent.endDate)}
          </span>
          <span className="flex items-center gap-1">
            <IconMapPin className="size-4" />
            {activeEvent.location}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <IconTicket className="size-4" />
              All Bookings
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-bold">{totalBookings}</p>
                <p className="text-sm text-muted-foreground">total</p>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {pendingBookings}
                </span>{" "}
                pending
              </p>
            </div>
            <Link href="/admin/bookings">
              <Button size="lg" className="py-5 px-6 text-base">
                View all bookings
                <IconArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <IconClockPause className="size-4" />
              Slots & Waitlist
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-bold">{totalWaiting}</p>
                <p className="text-sm text-muted-foreground">waiting</p>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {slotsWithWaitlist}
                </span>{" "}
                slots with waitlist
              </p>
            </div>
            <Link href="/admin/slots">
              <Button size="lg" className="py-5 px-6 text-base">
                Manage slots
                <IconArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="flex items-center justify-between py-2">
            <div>
              <p className="flex items-center gap-2 text-sm font-medium">
                <IconUsers className="size-4" />
                Vendor applications
              </p>
              {vendorStats && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {vendorStats.total} total · {vendorStats.pending} pending
                </p>
              )}
            </div>
            <Link href={`/admin/vendor-applications?eventId=${activeEvent.id}`}>
              <Button variant="link" size="sm">
                View
                <IconArrowRight className="ml-1 size-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between py-2">
            <div>
              <p className="flex items-center gap-2 text-sm font-medium">
                <IconUsers className="size-4" />
                Workshop applications
              </p>
              {workshopStats && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {workshopStats.total} total · {workshopStats.pending} pending
                </p>
              )}
            </div>
            <Link
              href={`/admin/workshop-applications?eventId=${activeEvent.id}`}
            >
              <Button variant="link" size="sm">
                View
                <IconArrowRight className="ml-1 size-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
