import { render } from "@react-email/render";
import { sendEmail } from "./index";
import VendorConfirmationEmail from "@/emails/vendor-confirmation";
import VendorAcceptanceEmail from "@/emails/vendor-acceptance";
import VendorRejectionEmail from "@/emails/vendor-rejection";
import { CURRENT_EVENT, eventDateFormat } from "@/lib/config/event";

type SendVendorConfirmationParams = {
  email: string;
  businessName: string;
  applicationId: string;
};

export async function sendVendorConfirmation({
  email,
  businessName,
  applicationId,
}: SendVendorConfirmationParams) {
  const html = await render(
    VendorConfirmationEmail({
      businessName,
      applicationId,
      submissionDate: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    }),
  );

  const result = await sendEmail({
    to: email,
    subject: `Vendor Application Received - ${CURRENT_EVENT.name}`,
    html,
  });

  if (!result.success) {
    console.error(
      "Failed to send vendor confirmation email:",
      { applicationId, email },
      result.error,
    );
  }

  return result;
}

type SendVendorAcceptanceParams = {
  email: string;
  businessName: string;
  applicationId: string;
};

export async function sendVendorAcceptance({
  email,
  businessName,
  applicationId,
}: SendVendorAcceptanceParams) {
  const html = await render(
    VendorAcceptanceEmail({
      businessName,
      applicationId,
      festivalDate: eventDateFormat.range(),
    }),
  );

  const result = await sendEmail({
    to: email,
    subject: `Vendor Application Approved - ${CURRENT_EVENT.name}`,
    html,
  });

  if (!result.success) {
    console.error(
      "Failed to send vendor acceptance email:",
      { applicationId, email },
      result.error,
    );
  }

  return result;
}

type SendVendorRejectionParams = {
  email: string;
  businessName: string;
  reason?: string;
};

export async function sendVendorRejection({
  email,
  businessName,
  reason,
}: SendVendorRejectionParams) {
  const html = await render(
    VendorRejectionEmail({
      businessName,
      reason,
    }),
  );

  const result = await sendEmail({
    to: email,
    subject: `Regarding Your Vendor Application - ${CURRENT_EVENT.name}`,
    html,
  });

  if (!result.success) {
    console.error(
      "Failed to send vendor rejection email:",
      { email },
      result.error,
    );
  }

  return result;
}
