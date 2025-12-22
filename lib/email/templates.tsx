export const welcomeEmail = (name: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Chefs Kiss</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 30px; margin-bottom: 20px;">
    <h1 style="color: #2c3e50; margin-bottom: 20px;">Welcome to Chefs Kiss!</h1>
    <p style="font-size: 16px; margin-bottom: 15px;">Hi ${name},</p>
    <p style="font-size: 16px; margin-bottom: 15px;">
      Thanks for signing up! We're excited to have you on board.
    </p>
    <p style="font-size: 16px; margin-bottom: 15px;">
      If you have any questions or need help getting started, feel free to reach out to our support team.
    </p>
  </div>
  <p style="color: #6c757d; font-size: 14px; text-align: center;">
    © ${new Date().getFullYear()} Chefs Kiss. All rights reserved.
  </p>
</body>
</html>
`;

export const verificationEmail = (verificationLink: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your email</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 30px; margin-bottom: 20px;">
    <h1 style="color: #2c3e50; margin-bottom: 20px;">Verify your email address</h1>
    <p style="font-size: 16px; margin-bottom: 15px;">
      Please click the button below to verify your email address.
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${verificationLink}" style="background-color: oklch(0.59 0.22 1); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
        Verify Email
      </a>
    </div>
    <p style="font-size: 14px; color: #6c757d; margin-top: 20px;">
      If you didn't create an account, you can safely ignore this email.
    </p>
  </div>
  <p style="color: #6c757d; font-size: 14px; text-align: center;">
    © ${new Date().getFullYear()} Chefs Kiss. All rights reserved.
  </p>
</body>
</html>
`;

export const vendorConfirmationEmail = ({
  businessName,
  applicationId,
  submissionDate,
}: {
  businessName: string;
  applicationId: string;
  submissionDate: string;
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vendor Application Received</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 30px; margin-bottom: 20px;">
    <h1 style="color: #2c3e50; margin-bottom: 20px;">Application Received!</h1>
    <p style="font-size: 16px; margin-bottom: 15px;">Dear ${businessName},</p>
    <p style="font-size: 16px; margin-bottom: 15px;">
      Thank you for your interest in participating in the Chef's Kiss Festival! We have successfully received your vendor application.
    </p>

    <div style="background-color: white; border-radius: 6px; padding: 20px; margin: 20px 0;">
      <h2 style="color: #2c3e50; font-size: 18px; margin-top: 0;">Application Details</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #6c757d; font-size: 14px;">Application ID:</td>
          <td style="padding: 8px 0; font-weight: 600; font-size: 14px;">${applicationId}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6c757d; font-size: 14px;">Business Name:</td>
          <td style="padding: 8px 0; font-weight: 600; font-size: 14px;">${businessName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6c757d; font-size: 14px;">Submission Date:</td>
          <td style="padding: 8px 0; font-weight: 600; font-size: 14px;">${submissionDate}</td>
        </tr>
      </table>
    </div>

    <h3 style="color: #2c3e50; font-size: 16px; margin-top: 25px; margin-bottom: 10px;">What Happens Next?</h3>
    <ul style="font-size: 15px; line-height: 1.8; padding-left: 20px;">
      <li>Our team will review your application within 5-7 business days</li>
      <li>We'll contact you via email with updates on your application status</li>
      <li>If approved, you'll receive detailed information about the festival logistics, setup times, and vendor guidelines</li>
      <li>Please keep your application ID for reference</li>
    </ul>

    <p style="font-size: 16px; margin-top: 25px; margin-bottom: 15px;">
      If you have any questions in the meantime, please don't hesitate to reach out to us.
    </p>

    <p style="font-size: 16px; margin-bottom: 15px;">
      We're excited about the possibility of having you at the festival!
    </p>

    <p style="font-size: 16px; margin-top: 25px;">
      Best regards,<br>
      <strong>The Chef's Kiss Festival Team</strong>
    </p>
  </div>

  <p style="color: #6c757d; font-size: 14px; text-align: center;">
    © ${new Date().getFullYear()} Chef's Kiss Festival. All rights reserved.
  </p>
</body>
</html>
`;
