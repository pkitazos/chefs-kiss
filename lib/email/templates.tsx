import { render } from "@react-email/render";
import WelcomeEmail from "@/emails/welcome";
import VerificationEmail from "@/emails/verification";
import VendorConfirmationEmail from "@/emails/vendor-confirmation";
import VendorAcceptanceEmail from "@/emails/vendor-acceptance";
import VendorRejectionEmail from "@/emails/vendor-rejection";

export const welcomeEmail = (name: string) =>
  render(<WelcomeEmail name={name} />);

export const verificationEmail = (verificationLink: string) =>
  render(<VerificationEmail verificationLink={verificationLink} />);

export const vendorConfirmationEmail = ({
  businessName,
  applicationId,
  submissionDate,
}: {
  businessName: string;
  applicationId: string;
  submissionDate: string;
}) =>
  render(
    <VendorConfirmationEmail
      businessName={businessName}
      applicationId={applicationId}
      submissionDate={submissionDate}
    />,
  );

export const vendorAcceptanceEmail = ({
  businessName,
  applicationId,
  festivalDate,
  setupTime,
  boothLocation,
}: {
  businessName: string;
  applicationId: string;
  festivalDate: string;
  setupTime: string;
  boothLocation?: string;
}) =>
  render(
    <VendorAcceptanceEmail
      businessName={businessName}
      applicationId={applicationId}
      festivalDate={festivalDate}
      setupTime={setupTime}
      boothLocation={boothLocation}
    />,
  );

export const vendorRejectionEmail = ({
  businessName,
  applicationId,
  reason,
}: {
  businessName: string;
  applicationId: string;
  reason?: string;
}) =>
  render(
    <VendorRejectionEmail
      businessName={businessName}
      applicationId={applicationId}
      reason={reason}
    />,
  );
