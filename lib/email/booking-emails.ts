import { render } from "@react-email/render";
import { sendEmail } from "./index";
import BookingConfirmationEmail from "@/emails/booking-confirmation";
import BookingCancellationEmail from "@/emails/booking-cancellation";
import { CURRENT_EVENT, eventDateFormat } from "@/lib/config/event";
import { getDiningSessionById } from "../config/private-dining";
import { getWorkshopSlotById } from "@/lib/config/workshops";

type SendBookingConfirmationParams = {
  email: string;
  fullName: string;
  bookingId: string;
  type: "private-dining" | "workshop";
  seats: number;
  slotId: string;
};

export function resolveSlotLabel(
  slotId: string,
  type: "private-dining" | "workshop",
): string {
  if (type === "private-dining") {
    const result = getDiningSessionById(slotId);

    if (!result)
      throw new Error(
        `Private dining session not found for slot ID: ${slotId}`,
      );

    return `${result.session.title} - ${eventDateFormat.dayName(result.day.date)} at ${result.session.time}`;
  }

  const result = getWorkshopSlotById(slotId);

  if (!result)
    throw new Error(`Workshop slot not found for slot ID: ${slotId}`);

  return `${result.workshop.title} - ${eventDateFormat.dayName(result.day.date)} at ${result.slot.time}`;
}

export function resolveSlotDetails(
  slotId: string,
  type: "private-dining" | "workshop",
): { label: string; price: number } {
  const label = resolveSlotLabel(slotId, type);
  const price =
    type === "private-dining"
      ? getDiningSessionById(slotId)!.session.price
      : getWorkshopSlotById(slotId)!.slot.price;
  return { label, price };
}

export async function sendBookingConfirmation({
  email,
  fullName,
  bookingId,
  type,
  seats,
  slotId,
}: SendBookingConfirmationParams) {
  const { label: slotLabel, price } = resolveSlotDetails(slotId, type);
  const total = price * seats;
  const totalFormatted = `\u20AC${total.toFixed(2)}`;

  const html = await render(
    BookingConfirmationEmail({
      fullName,
      bookingId,
      type,
      slotLabel,
      seats,
      totalFormatted,
    }),
  );

  const typeLabel = type === "private-dining" ? "Private Dining" : "Workshop";

  const result = await sendEmail({
    to: email,
    subject: `${typeLabel} Booking Confirmed - ${CURRENT_EVENT.name}`,
    html,
  });

  if (!result.success) {
    console.error(
      "Failed to send booking confirmation email:",
      { bookingId, email },
      result.error,
    );
  }

  return result;
}

type SendBookingCancellationParams = {
  email: string;
  fullName: string;
  bookingId: string;
  type: "private-dining" | "workshop";
  seats: number;
  slotId: string;
};

export async function sendBookingCancellation({
  email,
  fullName,
  bookingId,
  type,
  seats,
  slotId,
}: SendBookingCancellationParams) {
  const slotLabel = resolveSlotLabel(slotId, type);

  const html = await render(
    BookingCancellationEmail({
      fullName,
      bookingId,
      type,
      slotLabel,
      seats,
    }),
  );

  const typeLabel = type === "private-dining" ? "Private Dining" : "Workshop";

  const result = await sendEmail({
    to: email,
    subject: `${typeLabel} Booking Cancelled - ${CURRENT_EVENT.name}`,
    html,
  });

  if (!result.success) {
    console.error(
      "Failed to send booking cancellation email:",
      { bookingId, email },
      result.error,
    );
  }

  return result;
}
