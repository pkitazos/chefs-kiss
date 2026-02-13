"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  workshopCreationFormSchema,
  type WorkshopCreationFormData,
} from "@/lib/validations/workshop-creation-form";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  IconSend,
  IconLoader2,
  IconArrowRight,
  IconArrowLeft,
} from "@tabler/icons-react";

const PLACEHOLDERS = {
  generalInfo: {
    description: `Our Pottery & Wine workshop offers guests a relaxed, hands-on creative experience. Participants can enjoy
     wine tasting while crafting pottery pieces, guided by experienced instructors.`,
  },
  contentOutline: `This workshop combines a guided wine tasting with a hands-on pottery session in a small-group setting. Guests are introduced to a selection of wines from a featured winery while learning the fundamentals of working with clay.

With step-by-step guidance from the instructor, participants create their own ceramic piece, such as a bowl, cup, or decorative item, regardless of prior experience. The session is relaxed, practical, and interactive, offering a balanced mix of tasting, learning, and creating.

By the end of the workshop, attendees leave with a handmade piece and a clearer understanding of both the winemaking story and the pottery process.`,
  materialsAndTools: `Cutting boards, knives, mixing bowls, fresh herbs, olive oil, seasonal vegetables...`,
};

function WorkshopGuidelines({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium">
            Workshop Guidelines
          </CardTitle>
          <CardDescription className="text-sm">
            Please read the following guidelines carefully before submitting
            your application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 [&_ul]:list-disc [&_ul]:ml-12 [&_ul]:space-y-1.5">
          <p className="text-sm">
            This document outlines the general terms, requirements, and
            responsibilities for all workshop partners participating in
            Chef&apos;s Kiss events.
          </p>

          <Separator className="my-8" />

          <h3 className="font-semibold text-lg">1. General Overview</h3>
          <p className="text-sm">
            Chef&apos;s Kiss hosts a curated programme of workshops that align
            with the festival&apos;s creative, cultural, lifestyle, and culinary
            ethos.
          </p>
          <p className="text-sm">
            Workshop organisers are responsible for the design and delivery of
            their activity, while the event organisers provide infrastructure,
            visibility, and booking support to ensure a smooth participant
            experience.
          </p>

          <Separator className="my-8" />

          <h3 className="font-semibold text-lg">2. Workshop Space & Fees</h3>
          <p className="text-sm">
            A standard participation fee applies per workshop station:
          </p>
          <ul>
            <li className="text-sm">
              <strong>&euro;200 for one event day</strong>
            </li>
            <li className="text-sm">
              <strong>&euro;300 for both event days</strong>
            </li>
          </ul>
          <p className="text-sm">
            This fee covers the use of the workshop space, promotion through our
            media platforms, and inclusion in the event&apos;s official
            programme and booking system.
          </p>
          <p className="text-sm">
            All payments made by workshop attendees belong entirely to the
            workshop organiser.
          </p>

          <Separator className="my-8" />

          <h3 className="font-semibold text-lg">
            3. Booking, Payments & Participants
          </h3>
          <ul>
            <li className="text-sm">
              The event organisers will provide and manage the{" "}
              <strong>official booking system</strong> on the Chef&apos;s Kiss
              website.
            </li>
            <li className="text-sm">
              Workshop organisers are{" "}
              <strong>fully responsible for collecting payments</strong> from
              attendees.
            </li>
            <li className="text-sm">
              The event team will handle{" "}
              <strong>on-site hosting and reception</strong> of workshop
              participants.
            </li>
            <li className="text-sm">
              If a workshop is fully booked, the organiser will receive the{" "}
              <strong>
                final participant list 1&ndash;2 weeks prior to the event
              </strong>
              .
            </li>
          </ul>
          <p className="text-sm">
            Workshop organisers are strongly encouraged to implement a{" "}
            <strong>prepayment or deposit system</strong> to confirm bookings
            and minimise last-minute cancellations.
          </p>
          <p className="text-sm">
            If a workshop has{" "}
            <strong>no confirmed bookings one week prior to the event</strong>,
            the organiser must contact the event management team to discuss
            possible actions, including:
          </p>
          <ul>
            <li className="text-sm">Adjusting the workshop format,</li>
            <li className="text-sm">Revising the participation fee, or</li>
            <li className="text-sm">Cancelling the workshop.</li>
          </ul>

          <Separator className="my-8" />

          <h3 className="font-semibold text-lg">
            4. Provided by the Organisers
          </h3>
          <p className="text-sm">The event organisers will provide:</p>
          <ul>
            <li className="text-sm">
              A dedicated workshop space (indoor or outdoor, depending on
              availability and suitability).
            </li>
            <li className="text-sm">
              Inclusion in the official booking system and event programme.
            </li>
            <li className="text-sm">
              Promotion through official event channels and onsite signage.
            </li>
            <li className="text-sm">
              On-site participant reception and general event coordination.
            </li>
          </ul>
          <p className="text-sm">
            Any additional requirements must be communicated in advance and
            approved by the organisers.
          </p>

          <Separator className="my-8" />

          <h3 className="font-semibold text-lg">
            5. Workshop Materials & Equipment
          </h3>
          <ul>
            <li className="text-sm">
              All materials, tools, consumables, and ingredients are the{" "}
              <strong>sole responsibility of the workshop organiser</strong>.
            </li>
            <li className="text-sm">
              The organisers do not provide equipment or consumables unless
              explicitly agreed in advance.
            </li>
            <li className="text-sm">
              Workshop organisers must prepare their area before each session
              and maintain cleanliness throughout the event.
            </li>
          </ul>

          <Separator className="my-8" />

          <h3 className="font-semibold text-lg">6. Operations & Logistics</h3>
          <ul>
            <li className="text-sm">
              Setup and breakdown times will be communicated prior to the event.
            </li>
            <li className="text-sm">
              Organisers must arrive early enough to fully prepare before their
              first scheduled session.
            </li>
            <li className="text-sm">
              Workshop areas must remain clean, organised, and safe at all
              times.
            </li>
            <li className="text-sm">
              Any requirements for sound, electricity, or water must be
              requested and approved in advance.
            </li>
            <li className="text-sm">
              All activities must comply with event safety and operational
              standards.
            </li>
          </ul>

          <Separator className="my-8" />

          <h3 className="font-semibold text-lg">
            7. Promotion & Communication
          </h3>
          <ul>
            <li className="text-sm">
              Workshops will be featured on the event website, booking platform,
              and onsite programme.
            </li>
            <li className="text-sm">
              All public bookings will be managed through the official system.
            </li>
            <li className="text-sm">
              Organisers are encouraged to promote their workshop independently,
              tagging official event channels.
            </li>
            <li className="text-sm">
              Any custom marketing materials must align with the event&apos;s
              brand guidelines and may require approval.
            </li>
          </ul>

          <Separator className="my-8" />

          <h3 className="font-semibold text-lg">
            8. Cleaning & Responsibility
          </h3>
          <ul>
            <li className="text-sm">
              Workshop organisers are fully responsible for cleaning their area
              after each session and at the end of the event.
            </li>
            <li className="text-sm">
              Any damage or unclean conditions may result in a cleaning or
              repair fee charged by the organisers.
            </li>
          </ul>

          <Separator className="my-8" />

          <h3 className="font-semibold text-lg">Contact</h3>
          <p className="text-sm">
            For all workshop-related inquiries, please contact:
          </p>
          <ul>
            <li className="text-sm">
              Email:{" "}
              <a href="mailto:info@chefskiss.com.cy">info@chefskiss.com.cy</a>
            </li>
            <li className="text-sm">Phone: +357 99 145169</li>
            <li className="text-sm">Contact Person: Panagiotis Zantis</li>
          </ul>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="button" size="lg" onClick={onContinue}>
          Continue to Application
          <IconArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function WorkshopApplicationForm() {
  const [step, setStep] = useState<"guidelines" | "form">("guidelines");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WorkshopCreationFormData>({
    resolver: zodResolver(workshopCreationFormSchema),
    defaultValues: {
      generalInfo: { title: "", description: "" },
      contentOutline: "",
      sessionDetails: {
        duration: undefined,
        participantsPerSession: undefined,
        sessionsPerDay: undefined,
      },
      materialsAndTools: "",
      targetAudience: undefined,
      preferredParticipation: undefined,
      contactDetails: {
        contactPerson: "",
        email: "",
        phoneNumber: "",
        instagramHandle: "",
      },
    },
  });

  const onSubmit = async (data: WorkshopCreationFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Replace with tRPC mutation when backend is ready
      console.log("Workshop application data:", data);
      toast.success("Application Submitted!", {
        description:
          "Your workshop application has been received. We'll be in touch soon.",
      });
      reset();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      toast.error("Submission Failed", {
        description:
          "Something went wrong while submitting your application. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === "guidelines") {
    return (
      <WorkshopGuidelines
        onContinue={() => {
          setStep("form");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    );
  }

  // todo: add tooltip to the asterisks saying required
  return (
    <div className="space-y-6">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => {
          setStep("guidelines");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <IconArrowLeft className="mr-2 h-4 w-4" />
        Back to Guidelines
      </Button>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section 1: General Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">General Information</CardTitle>
            <CardDescription className="text-sm">
              Tell us about your workshop and what participants can expect
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FieldGroup>
              <FieldLabel htmlFor="title" required>
                Workshop Title
              </FieldLabel>
              <FieldDescription>
                A clear, catchy title for your workshop
              </FieldDescription>
              <Field>
                <Input
                  id="title"
                  placeholder="Pottery & Wine"
                  {...register("generalInfo.title")}
                  aria-invalid={!!errors.generalInfo?.title}
                />
              </Field>
              {errors.generalInfo?.title && (
                <FieldError>{errors.generalInfo.title.message}</FieldError>
              )}
            </FieldGroup>

            <FieldGroup>
              <FieldLabel htmlFor="description" required>
                Workshop Description
              </FieldLabel>
              <FieldDescription>
                A brief description of what participants will learn or
                experience
              </FieldDescription>
              <Field>
                <Textarea
                  id="description"
                  placeholder={PLACEHOLDERS.generalInfo.description}
                  {...register("generalInfo.description")}
                  aria-invalid={!!errors.generalInfo?.description}
                />
              </Field>
              {errors.generalInfo?.description && (
                <FieldError>
                  {errors.generalInfo.description.message}
                </FieldError>
              )}
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Section 2: Content & Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Content & Activities</CardTitle>
            <CardDescription className="text-sm">
              Outline the workshop content and what materials you&apos;ll need
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FieldGroup>
              <FieldLabel htmlFor="contentOutline" required>
                Content Outline
              </FieldLabel>
              <FieldDescription>
                Describe the activities and flow of your workshop
              </FieldDescription>
              <Field>
                <Textarea
                  id="contentOutline"
                  placeholder={PLACEHOLDERS.contentOutline}
                  {...register("contentOutline")}
                  aria-invalid={!!errors.contentOutline}
                />
              </Field>
              {errors.contentOutline && (
                <FieldError>{errors.contentOutline.message}</FieldError>
              )}
            </FieldGroup>

            <FieldGroup>
              <FieldLabel htmlFor="materialsAndTools" required>
                Materials & Tools
              </FieldLabel>
              <FieldDescription>
                List all materials, tools, and ingredients needed for the
                workshop
              </FieldDescription>
              <Field>
                <Textarea
                  id="materialsAndTools"
                  placeholder="Cutting boards, knives, mixing bowls, fresh herbs, olive oil, seasonal vegetables..."
                  {...register("materialsAndTools")}
                  aria-invalid={!!errors.materialsAndTools}
                />
              </Field>
              {errors.materialsAndTools && (
                <FieldError>{errors.materialsAndTools.message}</FieldError>
              )}
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Section 3: Session Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Session Details</CardTitle>
            <CardDescription className="text-sm">
              Specify the logistics for each session
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FieldGroup>
                <FieldLabel htmlFor="duration" required>
                  Duration (minutes)
                </FieldLabel>
                <Field>
                  <Input
                    id="duration"
                    type="number"
                    step="1"
                    placeholder="60"
                    {...register("sessionDetails.duration")}
                    aria-invalid={!!errors.sessionDetails?.duration}
                    onWheel={(e) => e.currentTarget.blur()}
                  />
                </Field>
                {errors.sessionDetails?.duration && (
                  <FieldError>
                    {errors.sessionDetails.duration.message}
                  </FieldError>
                )}
              </FieldGroup>

              <FieldGroup>
                <FieldLabel htmlFor="participantsPerSession" required>
                  Participants per Session
                </FieldLabel>
                <Field>
                  <Input
                    id="participantsPerSession"
                    type="number"
                    step="1"
                    placeholder="12"
                    {...register("sessionDetails.participantsPerSession")}
                    aria-invalid={
                      !!errors.sessionDetails?.participantsPerSession
                    }
                    onWheel={(e) => e.currentTarget.blur()}
                  />
                </Field>
                {errors.sessionDetails?.participantsPerSession && (
                  <FieldError>
                    {errors.sessionDetails.participantsPerSession.message}
                  </FieldError>
                )}
              </FieldGroup>

              <FieldGroup>
                <FieldLabel htmlFor="sessionsPerDay" required>
                  Sessions per Day
                </FieldLabel>
                <Field>
                  <Input
                    id="sessionsPerDay"
                    type="number"
                    step="1"
                    placeholder="3"
                    {...register("sessionDetails.sessionsPerDay")}
                    aria-invalid={!!errors.sessionDetails?.sessionsPerDay}
                    onWheel={(e) => e.currentTarget.blur()}
                  />
                </Field>
                {errors.sessionDetails?.sessionsPerDay && (
                  <FieldError>
                    {errors.sessionDetails.sessionsPerDay.message}
                  </FieldError>
                )}
              </FieldGroup>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Audience & Participation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Audience & Participation</CardTitle>
            <CardDescription className="text-sm">
              Who is this workshop for and how many days would you like to
              participate?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FieldGroup>
              <FieldLabel required>Target Audience</FieldLabel>
              <FieldDescription>
                Select the primary audience for your workshop
              </FieldDescription>
              <Controller
                control={control}
                name="targetAudience"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className="w-full"
                      aria-invalid={!!errors.targetAudience}
                    >
                      <SelectValue placeholder="Select target audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="adults">Adults</SelectItem>
                      <SelectItem value="families">Families</SelectItem>
                      <SelectItem value="children">Children</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.targetAudience && (
                <FieldError>{errors.targetAudience.message}</FieldError>
              )}
            </FieldGroup>

            <FieldGroup>
              <FieldLabel required>Preferred Participation</FieldLabel>
              <FieldDescription>
                How many days would you like to host your workshop?
              </FieldDescription>
              <Controller
                control={control}
                name="preferredParticipation"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className="w-full"
                      aria-invalid={!!errors.preferredParticipation}
                    >
                      <SelectValue placeholder="Select preferred participation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one day">One Day</SelectItem>
                      <SelectItem value="two days">Two Days</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.preferredParticipation && (
                <FieldError>{errors.preferredParticipation.message}</FieldError>
              )}
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Section 5: Contact Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Contact Details</CardTitle>
            <CardDescription className="text-sm">
              How can we reach you about your workshop application?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FieldGroup>
              <FieldLabel htmlFor="email" required>
                Email
              </FieldLabel>
              <FieldDescription>
                We&apos;ll use this for all communications about your workshop
              </FieldDescription>
              <Field>
                <Input
                  id="email"
                  type="email"
                  placeholder="info@workshop.com"
                  {...register("contactDetails.email")}
                  aria-invalid={!!errors.contactDetails?.email}
                />
              </Field>
              {errors.contactDetails?.email && (
                <FieldError>{errors.contactDetails.email.message}</FieldError>
              )}
            </FieldGroup>

            <FieldGroup>
              <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
              <FieldDescription>
                Optional - include country code
              </FieldDescription>
              <Field>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+357 99 999999"
                  {...register("contactDetails.phoneNumber")}
                  aria-invalid={!!errors.contactDetails?.phoneNumber}
                />
              </Field>
              {errors.contactDetails?.phoneNumber && (
                <FieldError>
                  {errors.contactDetails.phoneNumber.message}
                </FieldError>
              )}
            </FieldGroup>
          </CardContent>
        </Card>

        {/* todo: add confirmation "I agree blah bla bla" */}

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <IconSend className="mr-2 h-4 w-4" />
                Submit Application
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
