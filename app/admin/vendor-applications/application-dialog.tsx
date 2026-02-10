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
import { IconCopy, IconExternalLink, IconLoader2 } from "@tabler/icons-react";
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

function formatCurrency(value: string) {
  return new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency: "EUR",
  }).format(parseFloat(value));
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function DocumentLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-primary hover:underline"
    >
      {label}
      <IconExternalLink className="size-3" />
    </a>
  );
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
    api.vendors.getApplicationById.useQuery(
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
                <DialogTitle>{application.businessName}</DialogTitle>
                <Badge variant={statusVariants[application.status]}>
                  {application.status}
                </Badge>
              </div>
              <DialogDescription>
                Application ID: {application.id}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 pt-4">
              <Section title="Business Information">
                <Field label="Business Name" value={application.businessName} />
                <Field label="Company Name" value={application.companyName} />
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
                <Field
                  label="Submitted"
                  value={formatDate(application.createdAt)}
                />
              </Section>

              <Separator />

              <Section title="Menu">
                {application.dishes.length > 0 ? (
                  <div className="space-y-2">
                    {application.dishes.map((dish) => (
                      <div
                        key={dish.id}
                        className="flex justify-between text-foreground"
                      >
                        <span>{dish.name}</span>
                        <span>{formatCurrency(dish.price)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No dishes listed</p>
                )}
              </Section>

              <Separator />

              <Section title="Special Requirements">
                {application.specialRequirements && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Requirements
                    </p>
                    <p className="text-foreground">
                      {application.specialRequirements}
                    </p>
                  </div>
                )}
                {application.kitchenEquipment && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Kitchen Equipment
                    </p>
                    <p className="text-foreground">
                      {application.kitchenEquipment}
                    </p>
                  </div>
                )}
                {application.storage && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Storage
                    </p>
                    <p className="text-foreground">{application.storage}</p>
                  </div>
                )}
                {application.powerRequirements.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Power Supply
                    </p>
                    <div className="space-y-1">
                      {application.powerRequirements.map((power) => (
                        <div
                          key={power.id}
                          className="flex justify-between text-foreground"
                        >
                          <span>{power.device}</span>
                          <span>{power.wattage}W</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {!application.specialRequirements &&
                  !application.kitchenEquipment &&
                  !application.storage &&
                  application.powerRequirements.length === 0 && (
                    <p className="text-muted-foreground">
                      No special requirements
                    </p>
                  )}
              </Section>

              {application.truckInfo && (
                <>
                  <Separator />
                  <Section title="Truck Information">
                    <Field
                      label="Dimensions"
                      value={`${application.truckInfo.length}m × ${application.truckInfo.width}m × ${application.truckInfo.height}m`}
                    />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Photo</span>
                      <DocumentLink
                        href={application.truckInfo.photoUrl}
                        label="View Photo"
                      />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Electromechanical License
                      </span>
                      <DocumentLink
                        href={application.truckInfo.electroMechanicalLicenseUrl}
                        label="View Document"
                      />
                    </div>
                  </Section>
                </>
              )}

              <Separator />

              <Section title="Documents">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Business License
                  </span>
                  <DocumentLink
                    href={application.businessLicenseUrl}
                    label="View"
                  />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Hygiene Certification
                  </span>
                  <DocumentLink
                    href={application.hygieneInspectionCertificationUrl}
                    label="View"
                  />
                </div>
                {application.liabilityInsuranceUrl && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Liability Insurance
                    </span>
                    <DocumentLink
                      href={application.liabilityInsuranceUrl}
                      label="View"
                    />
                  </div>
                )}
              </Section>

              <Separator />

              <Section title="Employees">
                {application.employees.length > 0 ? (
                  <div className="space-y-3">
                    {application.employees.map((employee) => (
                      <div
                        key={employee.id}
                        className="border rounded-lg p-3 space-y-1"
                      >
                        <p className="text-foreground font-medium">
                          {employee.name}
                        </p>
                        <div className="flex gap-4 text-xs">
                          <DocumentLink
                            href={employee.healthCertificateUrl}
                            label="Health Certificate"
                          />
                          <DocumentLink
                            href={employee.socialInsuranceUrl}
                            label="Social Insurance"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No employees listed</p>
                )}
              </Section>
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
