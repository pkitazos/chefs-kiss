"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { IconLoader2 } from "@tabler/icons-react";
import { api } from "@/lib/trpc/client";
import { ApplicationDialog } from "./application-dialog";
import { ApplicationActions } from "./application-actions";

const statusVariants = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
} as const;

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
  }).format(new Date(date));
}

export function ApplicationsTable() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId") ?? undefined;

  const [selectedApplicationId, setSelectedApplicationId] = useState<
    string | null
  >(null);

  const {
    data: applications,
    isLoading,
    error,
  } = api.workshops.getAllApplications.useQuery(
    eventId ? { eventId } : undefined,
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <IconLoader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">
          Failed to load applications: {error.message}
        </p>
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="rounded-lg border bg-muted/50 p-8 text-center">
        <p className="text-muted-foreground">No applications yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {applications.length} application
          {applications.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Business Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell>
                  <button
                    onClick={() => setSelectedApplicationId(app.id)}
                    className="font-mono text-primary hover:underline"
                  >
                    {app.id}
                  </button>
                </TableCell>
                <TableCell
                  className="whitespace-normal wrap-break-word max-w-50"
                  title={app.workshopTitle}
                >
                  {app.workshopTitle}
                </TableCell>
                <TableCell
                  className="whitespace-normal wrap-break-word max-w-50"
                  title={app.contactPerson}
                >
                  {app.contactPerson}
                </TableCell>
                <TableCell
                  className="whitespace-normal wrap-break-word max-w-50"
                  title={app.email}
                >
                  {app.email}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariants[app.status]}>
                    {app.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(app.createdAt)}
                </TableCell>
                <TableCell>
                  <ApplicationActions
                    applicationId={app.id}
                    email={app.email}
                    contactPerson={app.contactPerson}
                    workshopTitle={app.workshopTitle}
                    currentStatus={app.status}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ApplicationDialog
        applicationId={selectedApplicationId}
        open={!!selectedApplicationId}
        onOpenChange={(open) => {
          if (!open) setSelectedApplicationId(null);
        }}
      />
    </>
  );
}
