import { render } from "@react-email/render";
import { sendEmail } from "./index";
import BookingConfirmationEmail from "@/emails/booking-confirmation";
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

function resolveSlotDetails(
  slotId: string,
  type: "private-dining" | "workshop",
): { label: string; price: number } {
  if (type === "private-dining") {
    const result = getDiningSessionById(slotId);

    if (!result)
      throw new Error(
        `Private dining session not found for slot ID: ${slotId}`,
      );

    return {
      label: `${result.session.title} - ${eventDateFormat.dayName(result.day.date)} at ${result.session.time}`,
      price: result.session.price,
    };
  }

  const result = getWorkshopSlotById(slotId);

  if (!result)
    throw new Error(`Workshop slot not found for slot ID: ${slotId}`);

  return {
    label: `${result.workshop.title} - ${eventDateFormat.dayName(result.day.date)} at ${result.slot.time}`,
    price: result.slot.price,
  };
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
