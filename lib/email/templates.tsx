import { render } from "@react-email/render";
import VendorConfirmationEmail from "@/emails/vendor-confirmation";
import VendorAcceptanceEmail from "@/emails/vendor-acceptance";
import VendorRejectionEmail from "@/emails/vendor-rejection";

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
}: {
  businessName: string;
  applicationId: string;
  festivalDate: string;
}) =>
  render(
    <VendorAcceptanceEmail
      businessName={businessName}
      applicationId={applicationId}
      festivalDate={festivalDate}
    />,
  );

export const vendorRejectionEmail = ({
  businessName,
  reason,
}: {
  businessName: string;
  applicationId: string;
  reason?: string;
}) =>
  render(<VendorRejectionEmail businessName={businessName} reason={reason} />);
