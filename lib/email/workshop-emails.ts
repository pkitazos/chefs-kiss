import { render } from "@react-email/render";
import { sendEmail } from "./index";
import WorkshopConfirmationEmail from "@/emails/workshop-confirmation";
import WorkshopAcceptanceEmail from "@/emails/workshop-acceptance";
import WorkshopRejectionEmail from "@/emails/workshop-rejection";

type SendWorkshopConfirmationParams = {
  email: string;
  contactPerson: string;
  workshopTitle: string;
  applicationId: string;
};

export async function sendWorkshopConfirmation({
  email,
  contactPerson,
  workshopTitle,
  applicationId,
}: SendWorkshopConfirmationParams) {
  const html = await render(
    WorkshopConfirmationEmail({
      contactPerson,
      workshopTitle,
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
    subject: "Workshop Application Received - Chef's Kiss Festival",
    html,
  });

  if (!result.success) {
    console.error(
      "Failed to send workshop confirmation email:",
      { applicationId, email },
      result.error,
    );
  }

  return result;
}

type SendWorkshopAcceptanceParams = {
  email: string;
  contactPerson: string;
  workshopTitle: string;
  applicationId: string;
  festivalDate: string;
};

export async function sendWorkshopAcceptance({
  email,
  contactPerson,
  workshopTitle,
  applicationId,
  festivalDate,
}: SendWorkshopAcceptanceParams) {
  const html = await render(
    WorkshopAcceptanceEmail({
      contactPerson,
      workshopTitle,
      applicationId,
      festivalDate,
    }),
  );

  const result = await sendEmail({
    to: email,
    subject: "Workshop Application Approved - Chef's Kiss Festival",
    html,
  });

  if (!result.success) {
    console.error(
      "Failed to send workshop acceptance email:",
      { applicationId, email },
      result.error,
    );
  }

  return result;
}

type SendWorkshopRejectionParams = {
  email: string;
  contactPerson: string;
  reason?: string;
};

export async function sendWorkshopRejection({
  email,
  contactPerson,
  reason,
}: SendWorkshopRejectionParams) {
  const html = await render(
    WorkshopRejectionEmail({
      contactPerson,
      reason,
    }),
  );

  const result = await sendEmail({
    to: email,
    subject: "Regarding Your Workshop Application - Chef's Kiss Festival",
    html,
  });

  if (!result.success) {
    console.error(
      "Failed to send workshop rejection email:",
      { contactPerson, email },
      result.error,
    );
  }

  return result;
}
