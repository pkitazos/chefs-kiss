"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/trpc/client";
import Link from "next/link";
import {
  IconLoader2,
  IconCalendar,
  IconMapPin,
  IconUsers,
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
  const { data: allEvents, isLoading: eventsLoading } =
    api.events.getAllEvents.useQuery();

  const isLoading = eventLoading || eventsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <IconLoader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const { event: activeEvent, stats } = activeEventData ?? {};

  return (
    <div className="space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the Chef&apos;s Kiss event management system
        </p>
      </div>

      {/* Active Event Section */}
      {activeEvent ? (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="default" className="mb-2">
                  Active Event
                </Badge>
                <CardTitle className="text-xl">{activeEvent.name}</CardTitle>
                <CardDescription className="mt-2 flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <IconCalendar className="size-4" />
                    {formatDateRange(activeEvent.startDate, activeEvent.endDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <IconMapPin className="size-4" />
                    {activeEvent.location}
                  </span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {stats && (
              <div className="mb-4 grid grid-cols-4 gap-4">
                <div className="rounded-lg bg-background p-3 text-center">
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">
                    Total Applications
                  </p>
                </div>
                <div className="rounded-lg bg-background p-3 text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.pending}
                  </p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
                <div className="rounded-lg bg-background p-3 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {stats.approved}
                  </p>
                  <p className="text-xs text-muted-foreground">Approved</p>
                </div>
                <div className="rounded-lg bg-background p-3 text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {stats.rejected}
                  </p>
                  <p className="text-xs text-muted-foreground">Rejected</p>
                </div>
              </div>
            )}
            <Link href={`/admin/vendor-applications?eventId=${activeEvent.id}`}>
              <Button>
                <IconUsers className="mr-2 size-4" />
                View Vendor Applications
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              No active event. Create an event to start accepting applications.
            </p>
          </CardContent>
        </Card>
      )}

      {/* All Events Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Events</CardTitle>
          <CardDescription>All past, present, and future events</CardDescription>
        </CardHeader>
        <CardContent>
          {allEvents && allEvents.length > 0 ? (
            <div className="space-y-3">
              {allEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{event.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateRange(event.startDate, event.endDate)} -{" "}
                      {event.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {event.isActive && <Badge variant="default">Active</Badge>}
                    <Badge variant="secondary">{event.locationCode}</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No events yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
