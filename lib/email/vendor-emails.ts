import { sendEmail } from "./index";
import { getVendorConfirmationEmailTemplate } from "./templates/vendor-confirmation";

type SendVendorConfirmationParams = {
  email: string;
  contactPerson: string;
  businessName: string;
  applicationId: string;
};

export async function sendVendorConfirmation({
  email,
  contactPerson,
  businessName,
  applicationId,
}: SendVendorConfirmationParams) {
  const { subject, html } = getVendorConfirmationEmailTemplate({
    contactPerson,
    businessName,
    applicationId,
  });

  const result = await sendEmail({
    to: email,
    subject,
    html,
  });

  if (!result.success) {
    console.error(
      "Failed to send vendor confirmation email:",
      { applicationId, email },
      result.error
    );
  }

  return result;
}
