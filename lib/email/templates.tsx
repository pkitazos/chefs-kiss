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
