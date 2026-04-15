"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader2, IconToolsKitchen2 } from "@tabler/icons-react";
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

interface PrivateDiningBookingFormProps {
  sessionId: string;
  sessionTitle: string;
  sessionTime: string;
  sessionLocation: string;
  sessionDate: string;
  price: number;
  capacity: number;
}

const MAX_SEATS = 6;

export function PrivateDiningBookingForm({
  sessionId,
  sessionTitle,
  sessionTime,
  sessionLocation,
  sessionDate,
  price,
  capacity,
}: PrivateDiningBookingFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = createBookingFormSchema(MAX_SEATS);
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
    slotId: sessionId,
  });

  const remaining = availability.data?.remaining ?? capacity;
  const maxBookable = Math.min(MAX_SEATS, remaining);

  const createBooking = api.bookings.create.useMutation({
    onSuccess: (data) => {
      router.push(`/private-dining/book/status?ref=${data.bookingId}`);
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
      slotId: sessionId,
      type: "private-dining",
      browserSessionId: getBrowserSessionId(),
    });
  };

  const date = new Date(sessionDate);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <SectionLabel>Private Dining</SectionLabel>
        <h1 className="font-display text-3xl tracking-tight">
          Reserve Your Seats
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{sessionTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground space-y-1 text-sm">
            <p>{eventDateFormat.dayName(date)}</p>
            <p>
              {sessionTime} &middot; {sessionLocation}
            </p>
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
              size="cta-md"
              disabled={isSubmitting || remaining === 0}
            >
              {isSubmitting ? (
                <>
                  <IconLoader2 className="animate-spin" />
                  Reserving…
                </>
              ) : (
                <>
                  <IconToolsKitchen2 />
                  Reserve
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
