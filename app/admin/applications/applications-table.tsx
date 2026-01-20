"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconDotsVertical,
  IconDownload,
  IconEye,
  IconEyeOff,
  IconLoader2,
} from "@tabler/icons-react";
import { api } from "@/lib/trpc/client";
import { ApplicationActions } from "./application-actions";
import { ApplicationDialog } from "./application-dialog";
import { exportApplicationsToCSV } from "./utils/export-csv";
import { cn } from "@/lib/utils";

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

function truncateId(id: string) {
  return id.slice(0, 8) + "...";
}

export function ApplicationsTable() {
  const [wrappedView, setWrappedView] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    string | null
  >(null);

  const {
    data: applications,
    isLoading,
    error,
  } = api.vendors.getAllApplications.useQuery();

  const handleExportCSV = () => {
    if (applications) {
      exportApplicationsToCSV(applications);
    }
  };

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
        <Button
          variant="outline"
          size="sm"
          onClick={() => setWrappedView(!wrappedView)}
        >
          {wrappedView ? (
            <>
              <IconEyeOff className="size-4" />
              Truncate
            </>
          ) : (
            <>
              <IconEye className="size-4" />
              Expand
            </>
          )}
        </Button>
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
              <TableHead className="w-12.5">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-xs">
                      <IconDotsVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleExportCSV}>
                      <IconDownload />
                      Download all as CSV
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
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
                    {truncateId(app.id)}
                  </button>
                </TableCell>
                <TableCell
                  className={cn(
                    wrappedView
                      ? "whitespace-normal wrap-break-word max-w-50"
                      : "truncate max-w-37.5"
                  )}
                  title={app.businessName}
                >
                  {app.businessName}
                </TableCell>
                <TableCell
                  className={cn(
                    wrappedView
                      ? "whitespace-normal wrap-break-word max-w-37.5"
                      : "truncate max-w-30"
                  )}
                  title={app.contactPerson}
                >
                  {app.contactPerson}
                </TableCell>
                <TableCell
                  className={cn(
                    wrappedView
                      ? "whitespace-normal wrap-break-word max-w-50"
                      : "truncate max-w-37.5"
                  )}
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
                    businessName={app.businessName}
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
