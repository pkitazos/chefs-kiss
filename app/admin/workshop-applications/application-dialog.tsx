"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/trpc/client";
import { copyToClipboard } from "@/lib/utils";
import { IconCopy, IconLoader2 } from "@tabler/icons-react";
import { toast } from "sonner";

interface ApplicationDialogProps {
  applicationId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusVariants = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
} as const;

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="font-semibold text-sm mb-2">{title}</h3>
      <div className="space-y-1 text-muted-foreground">{children}</div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}

function CopyableField({
  label,
  value,
  toastMessage,
}: {
  label: string;
  value: string;
  toastMessage: string;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <button
        onClick={async () => {
          await copyToClipboard(value);
          toast.success(toastMessage);
        }}
        className="group inline-flex items-center gap-1 text-primary hover:underline cursor-pointer"
      >
        <IconCopy className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        {value}
      </button>
    </div>
  );
}

export function ApplicationDialog({
  applicationId,
  open,
  onOpenChange,
}: ApplicationDialogProps) {
  const { data: application, isLoading } =
    api.workshops.getApplicationById.useQuery(
      { id: applicationId! },
      { enabled: open && !!applicationId },
    );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <IconLoader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : application ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <DialogTitle>{application.workshopTitle}</DialogTitle>
                <Badge variant={statusVariants[application.status]}>
                  {application.status}
                </Badge>
              </div>
              <DialogDescription>
                Application ID: {application.id}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 pt-4">
              <Section title="Workshop Details">
                {/* this is a textarea so it will likely be lots of test */}
                <Field label="Title" value={application.workshopTitle} />
                {/* this is a textarea so it will likely be lots of test */}
                <Field
                  label="Description"
                  value={application.workshopDescription}
                />
                {/* this is a textarea so it will likely be lots of test */}
                <Field
                  label="Content Outline"
                  value={application.contentOutline}
                />

                <Field
                  label="Session Duration (min)"
                  value={application.sessionDuration}
                />
                <Field
                  label="Participants Per Session"
                  value={application.participantsPerSession}
                />
                <Field
                  label="Sessions Per Day"
                  value={application.sessionsPerDay}
                />

                {/* this is a textarea so it will likely be lots of test */}
                <Field
                  label="Materials & Tools"
                  value={application.materialsAndTools}
                />

                {/* this is an enum -> auto-coloured badge */}
                <Field
                  label="Target Audience"
                  value={application.targetAudience}
                />
                {/* this is an enum -> auto-coloured badge */}
                <Field
                  label="Preferred Participation"
                  value={application.preferredParticipation}
                />
              </Section>

              <Separator />

              <Section title="Contact Details">
                <Field
                  label="Workshop Title"
                  value={application.workshopTitle}
                />
                <Field
                  label="Contact Person"
                  value={application.contactPerson}
                />
                <CopyableField
                  label="Email"
                  value={application.email}
                  toastMessage="Email copied to clipboard"
                />
                <Field label="Phone" value={application.phoneNumber} />
                {application.instagramHandle && (
                  <CopyableField
                    label="Instagram"
                    value={application.instagramHandle}
                    toastMessage="Instagram handle copied to clipboard"
                  />
                )}
              </Section>
              <Separator />
              <Field
                label="Submitted"
                value={formatDate(application.createdAt)}
              />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Application not found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
