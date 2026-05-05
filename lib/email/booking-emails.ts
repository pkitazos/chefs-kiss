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

export type SlotInfo = {
  title: string;
  date: string;
  time: string;
};

export function resolveSlotInfo(
  slotId: string,
  type: "private-dining" | "workshop",
): SlotInfo {
  if (type === "private-dining") {
    const result = getDiningSessionById(slotId);

    if (!result)
      throw new Error(
        `Private dining session not found for slot ID: ${slotId}`,
      );

    return {
      title: result.session.title,
      date: eventDateFormat.dayName(result.day.date),
      time: result.session.time,
    };
  }

  const result = getWorkshopSlotById(slotId);

  if (!result)
    throw new Error(`Workshop slot not found for slot ID: ${slotId}`);

  return {
    title: result.workshop.title,
    date: eventDateFormat.dayName(result.day.date),
    time: result.slot.time,
  };
}

export function resolveSlotLabel(
  slotId: string,
  type: "private-dining" | "workshop",
): string {
  const { title, date, time } = resolveSlotInfo(slotId, type);
  return `${title} - ${date} at ${time}`;
}

export function resolveSlotDetails(
  slotId: string,
  type: "private-dining" | "workshop",
): { slot: SlotInfo; price: number } {
  const slot = resolveSlotInfo(slotId, type);
  const price =
    type === "private-dining"
      ? getDiningSessionById(slotId)!.session.price
      : getWorkshopSlotById(slotId)!.slot.price;
  return { slot, price };
}

export async function sendBookingConfirmation({
  email,
  fullName,
  bookingId,
  type,
  seats,
  slotId,
}: SendBookingConfirmationParams) {
  const { slot, price } = resolveSlotDetails(slotId, type);
  const total = price * seats;
  const totalFormatted = `\u20AC${total.toFixed(2)}`;

  const html = await render(
    BookingConfirmationEmail({
      fullName,
      bookingId,
      type,
      sessionTitle: slot.title,
      sessionDate: slot.date,
      sessionTime: slot.time,
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
  const slot = resolveSlotInfo(slotId, type);

  const html = await render(
    BookingCancellationEmail({
      fullName,
      bookingId,
      type,
      sessionTitle: slot.title,
      sessionDate: slot.date,
      sessionTime: slot.time,
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
