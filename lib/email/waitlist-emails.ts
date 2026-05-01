import { render } from "@react-email/render";
import { sendEmail } from "./index";
import { resolveSlotDetails, resolveSlotLabel } from "./booking-emails";
import WaitlistConfirmationEmail from "@/emails/waitlist-confirmation";
import WaitlistPaymentConfirmationEmail from "@/emails/waitlist-payment-confirmation";
import WaitlistPromotionEmail from "@/emails/waitlist-promotion";
import { CURRENT_EVENT } from "@/lib/config/event";
import { clientEnv } from "@/lib/env";

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
  waitlistEntryId: string;
  type: "private-dining" | "workshop";
  partySize: number;
  slotId: string;
};

export async function sendWaitlistPromotion({
  email,
  fullName,
  waitlistEntryId,
  type,
  partySize,
  slotId,
}: SendWaitlistPromotionParams) {
  const { label: slotLabel, price } = resolveSlotDetails(slotId, type);
  const total = price * partySize;
  const totalFormatted = `€${total.toFixed(2)}`;
  const claimUrl = `${clientEnv.NEXT_PUBLIC_APP_URL}/waitlist/claim?id=${waitlistEntryId}`;

  const html = await render(
    WaitlistPromotionEmail({
      fullName,
      claimUrl,
      slotLabel,
      partySize,
      totalFormatted,
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
      { waitlistEntryId, email },
      result.error,
    );
  }

  return result;
}

type SendWaitlistPaymentConfirmationParams = {
  email: string;
  fullName: string;
  bookingId: string;
  type: "private-dining" | "workshop";
  seats: number;
  slotId: string;
};

export async function sendWaitlistPaymentConfirmation({
  email,
  fullName,
  bookingId,
  type,
  seats,
  slotId,
}: SendWaitlistPaymentConfirmationParams) {
  const { label: slotLabel, price } = resolveSlotDetails(slotId, type);
  const total = price * seats;
  const totalFormatted = `€${total.toFixed(2)}`;

  const html = await render(
    WaitlistPaymentConfirmationEmail({
      fullName,
      bookingId,
      type,
      slotLabel,
      seats,
      totalFormatted,
    }),
  );

  const result = await sendEmail({
    to: email,
    subject: `Spot Confirmed - ${CURRENT_EVENT.name}`,
    html,
  });

  if (!result.success) {
    console.error(
      "Failed to send waitlist payment confirmation email:",
      { bookingId, email },
      result.error,
    );
  }

  return result;
}
