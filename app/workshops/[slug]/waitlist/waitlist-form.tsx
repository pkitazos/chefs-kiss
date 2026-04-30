"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconArrowLeft,
  IconCircleCheck,
  IconHourglass,
  IconLoader2,
} from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { cn } from "@/lib/utils";
import {
  createBookingFormSchema,
  type BookingFormData,
} from "@/lib/validations/booking";

function getSeatOptions(maxSeats: number): number[] {
  return Array.from({ length: maxSeats }, (_, i) => i + 1);
}

interface WorkshopWaitlistFormProps {
  workshopSlug: string;
  workshopTitle: string;
  slotId: string;
  slotTime: string;
  slotLocation: string;
  slotShortDescription?: string;
  slotDate: string;
  price: number;
  maxSeatsPerBooking: number;
}

export function WorkshopWaitlistForm({
  workshopSlug,
  workshopTitle,
  slotId,
  slotTime,
  slotLocation,
  slotShortDescription,
  slotDate,
  price,
  maxSeatsPerBooking,
}: WorkshopWaitlistFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [waitlistId, setWaitlistId] = useState<string | null>(null);

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
      agreeToTerms: false,
    },
  });

  const agreeToTerms = watch("agreeToTerms");

  const joinWaitlist = api.waitlist.create.useMutation({
    onSuccess: (data) => {
      setWaitlistId(data.id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onError: (error) => {
      toast.error("Could not join waitlist", { description: error.message });
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: BookingFormData) => {
    setIsSubmitting(true);
    joinWaitlist.mutate({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      partySize: data.seats,
      slotId,
      type: "workshop",
    });
  };

  const date = new Date(slotDate);

  if (waitlistId) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <SectionLabel>Workshop</SectionLabel>
          <h1 className="font-display text-3xl tracking-tight">
            You&apos;re on the waitlist
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconCircleCheck className="text-primary size-5" />
              Waitlist confirmed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <p>
                Thanks! We&apos;ll email you at the address you provided if a
                spot opens up for {workshopTitle} on{" "}
                {eventDateFormat.dayName(date)}.
              </p>
              <p className="text-muted-foreground">
                Your waitlist ID:{" "}
                <span className="text-foreground font-semibold">
                  {waitlistId}
                </span>
              </p>
              <p className="text-muted-foreground">
                Being on the waitlist does not guarantee a seat. Spots are
                offered in order as they become available.
              </p>
            </div>
          </CardContent>
        </Card>

        <Link
          href={`/workshops/${workshopSlug}`}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <IconArrowLeft />
          Back to Workshop
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <SectionLabel>Workshop</SectionLabel>
        <h1 className="font-display text-3xl tracking-tight">
          Join the Waitlist
        </h1>
        <p className="text-muted-foreground text-sm">
          This session is fully booked. Leave your details and we&apos;ll email
          you if a spot opens up.
        </p>
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
          </div>
        </CardContent>
      </Card>

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
                  Party Size
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
                        <SelectValue placeholder="Select party size" />
                      </SelectTrigger>
                      <SelectContent>
                        {getSeatOptions(maxSeatsPerBooking).map((n) => (
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

        <div className="mt-6 space-y-4">
          <Field>
            <div className="flex flex-row items-start gap-3">
              <Controller
                control={control}
                name="agreeToTerms"
                render={({ field }) => (
                  <Checkbox
                    id="agreeToTerms"
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                    aria-invalid={!!errors.agreeToTerms}
                    className="mt-0.5"
                  />
                )}
              />
              <FieldLabel
                htmlFor="agreeToTerms"
                className="text-sm font-normal leading-snug"
              >
                I agree to the{" "}
                <Link href="/toc" className="underline underline-offset-2">
                  Terms &amp; Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline underline-offset-2">
                  Privacy Policy
                </Link>
                .
              </FieldLabel>
            </div>
            {errors.agreeToTerms && (
              <FieldError>{errors.agreeToTerms.message}</FieldError>
            )}
          </Field>

          <div className="flex items-center justify-end">
            <Button
              type="submit"
              size="cta"
              disabled={isSubmitting || !agreeToTerms}
            >
              {isSubmitting ? (
                <>
                  <IconLoader2 className="animate-spin" />
                  Joining…
                </>
              ) : (
                <>
                  <IconHourglass />
                  Join Waitlist
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
