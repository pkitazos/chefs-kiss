"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconAlertTriangle,
  IconLoader2,
  IconShoppingCart,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SectionLabel } from "@/components/ui/section-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { eventDateFormat } from "@/lib/config/event";
import { api } from "@/lib/trpc/client";
import {
  createBookingFormSchema,
  type BookingFormData,
} from "@/lib/validations/booking";

function getBrowserSessionId() {
  const key = "ck-browser-session-id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

interface WorkshopBookingFormProps {
  workshopSlug: string;
  workshopTitle: string;
  slotId: string;
  slotTime: string;
  slotLocation: string;
  slotShortDescription?: string;
  slotDate: string;
  price: number;
  capacity: number;
  maxSeatsPerBooking: number;
}

export function WorkshopBookingForm({
  workshopSlug,
  workshopTitle,
  slotId,
  slotTime,
  slotLocation,
  slotShortDescription,
  slotDate,
  price,
  capacity,
  maxSeatsPerBooking,
}: WorkshopBookingFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = createBookingFormSchema(maxSeatsPerBooking);
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      seats: 1,
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const seats = watch("seats");

  const availability = api.bookings.getSlotAvailability.useQuery({
    slotId,
  });

  const remaining = availability.data?.remaining ?? capacity;
  const maxBookable = Math.min(maxSeatsPerBooking, remaining);

  const browserSessionId =
    typeof window !== "undefined" ? getBrowserSessionId() : undefined;

  const overlaps = api.bookings.checkOverlaps.useQuery(
    { browserSessionId: browserSessionId!, slotId },
    { enabled: !!browserSessionId },
  );

  const createBooking = api.bookings.create.useMutation({
    onSuccess: (data) => {
      router.push(
        `/workshops/${workshopSlug}/book/status?ref=${data.bookingId}`,
      );
    },
    onError: (error) => {
      toast.error("Booking failed", { description: error.message });
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: BookingFormData) => {
    setIsSubmitting(true);
    createBooking.mutate({
      ...data,
      slotId,
      type: "workshop",
      browserSessionId: getBrowserSessionId(),
    });
  };

  const date = new Date(slotDate);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <SectionLabel>Workshop</SectionLabel>
        <h1 className="font-display text-3xl tracking-tight">Book Your Spot</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{workshopTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground space-y-1 text-sm">
            <p>{eventDateFormat.dayName(date)}</p>
            <p>
              {slotTime} &middot; {slotLocation}
            </p>
            {slotShortDescription && <p>{slotShortDescription}</p>}
            <p className="font-medium text-foreground">
              &euro;{price}
              <span className="text-muted-foreground font-normal">/person</span>
            </p>
            {availability.data && (
              <p>
                {remaining > 0
                  ? `${remaining} seat${remaining === 1 ? "" : "s"} remaining`
                  : "Fully booked"}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {overlaps.data && overlaps.data.conflicts.length > 0 && (
        <div className="flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
          <IconAlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Scheduling conflict</p>
            <p className="text-muted-foreground text-sm">
              You have other workshop bookings on the same day:
            </p>
            <ul className="text-muted-foreground list-disc pl-4 text-sm">
              {overlaps.data.conflicts.map((c, i) => (
                <li key={i}>
                  {c.title} ({c.time})
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {remaining > 0 ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Your Details</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="fullName" required>
                    Full Name
                  </FieldLabel>
                  <Input
                    id="fullName"
                    {...register("fullName")}
                    aria-invalid={!!errors.fullName}
                  />
                  {errors.fullName && (
                    <FieldError>{errors.fullName.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="email" required>
                    Email
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <FieldError>{errors.email.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="phone" required>
                    Phone
                  </FieldLabel>
                  <Input
                    id="phone"
                    type="tel"
                    {...register("phone")}
                    aria-invalid={!!errors.phone}
                  />
                  {errors.phone && (
                    <FieldError>{errors.phone.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="seats" required>
                    Number of Seats
                  </FieldLabel>
                  <Controller
                    control={control}
                    name="seats"
                    render={({ field }) => (
                      <Select
                        value={String(field.value)}
                        onValueChange={(val) => field.onChange(Number(val))}
                      >
                        <SelectTrigger
                          className="w-full"
                          aria-invalid={!!errors.seats}
                        >
                          <SelectValue placeholder="Select seats" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from(
                            { length: maxBookable },
                            (_, i) => i + 1,
                          ).map((n) => (
                            <SelectItem key={n} value={String(n)}>
                              {n} {n === 1 ? "seat" : "seats"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.seats && (
                    <FieldError>{errors.seats.message}</FieldError>
                  )}
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm font-semibold">
              Total: &euro;{price * (seats || 1)}
            </p>
            <Button
              type="submit"
              size="cta"
              disabled={isSubmitting || remaining === 0}
            >
              {isSubmitting ? (
                <>
                  <IconLoader2 className="animate-spin" />
                  Booking…
                </>
              ) : (
                <>
                  <IconShoppingCart />
                  {/*<IconCreditCard />*/}
                  Pay
                </>
              )}
            </Button>
          </div>
        </form>
      ) : (
        <div className="border-l-4 border-destructive bg-destructive/5 p-4">
          <p className="text-sm font-medium">
            This session is fully booked. Please check other available sessions.
          </p>
        </div>
      )}
    </div>
  );
}
