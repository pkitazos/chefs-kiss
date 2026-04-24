import { render } from "@react-email/render";
import { sendEmail } from "./index";
import { resolveSlotLabel } from "./booking-emails";
import WaitlistConfirmationEmail from "@/emails/waitlist-confirmation";
import WaitlistPromotionEmail from "@/emails/waitlist-promotion";
import { CURRENT_EVENT } from "@/lib/config/event";

type SendWaitlistConfirmationParams = {
  email: string;
  fullName: string;
  waitlistId: string;
  type: "private-dining" | "workshop";
  partySize: number;
  slotId: string;
};

export async function sendWaitlistConfirmation({
  email,
  fullName,
  waitlistId,
  type,
  partySize,
  slotId,
}: SendWaitlistConfirmationParams) {
  const slotLabel = resolveSlotLabel(slotId, type);
  const submissionDate = new Date().toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const html = await render(
    WaitlistConfirmationEmail({
      fullName,
      waitlistId,
      slotLabel,
      partySize,
      submissionDate,
    }),
  );

  const result = await sendEmail({
    to: email,
    subject: `You're on the waitlist - ${CURRENT_EVENT.name}`,
    html,
  });

  if (!result.success) {
    console.error(
      "Failed to send waitlist confirmation email:",
      { waitlistId, email },
      result.error,
    );
  }

  return result;
}

type SendWaitlistPromotionParams = {
  email: string;
  fullName: string;
  bookingId: string;
  type: "private-dining" | "workshop";
  partySize: number;
  slotId: string;
};

export async function sendWaitlistPromotion({
  email,
  fullName,
  bookingId,
  type,
  partySize,
  slotId,
}: SendWaitlistPromotionParams) {
  const slotLabel = resolveSlotLabel(slotId, type);

  const html = await render(
    WaitlistPromotionEmail({
      fullName,
      bookingId,
      slotLabel,
      partySize,
    }),
  );

  const result = await sendEmail({
    to: email,
    subject: `A spot opened up - ${CURRENT_EVENT.name}`,
    html,
  });

  if (!result.success) {
    console.error(
      "Failed to send waitlist promotion email:",
      { bookingId, email },
      result.error,
    );
  }

  return result;
}
