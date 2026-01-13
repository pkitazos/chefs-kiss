type VendorConfirmationEmailData = {
  contactPerson: string;
  businessName: string;
  applicationId: string;
};

export function getVendorConfirmationEmailTemplate({
  contactPerson,
  businessName,
  applicationId,
}: VendorConfirmationEmailData) {
  return {
    subject: "Vendor Application Received - Chef's Kiss Festival",
    html: `
      <h1>Thank you for your application!</h1>
      <p>Dear ${contactPerson},</p>
      <p>We have successfully received your vendor application for <strong>${businessName}</strong>.</p>
      <p><strong>Application ID:</strong> ${applicationId}</p>
      <p>Our team will review your application and get back to you soon.</p>
      <br />
      <p>Best regards,<br />Chef's Kiss Festival Team</p>
    `,
  };
}
