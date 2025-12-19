# Email with Resend

This project uses [Resend](https://resend.com) for sending transactional emails.

## File Locations

- **Email Client**: [lib/email/index.ts](../lib/email/index.ts)
- **Email Templates**: [lib/email/templates.tsx](../lib/email/templates.tsx)

## Setup

1. Sign up at [Resend](https://resend.com)
2. Verify your domain (or use `onboarding@resend.dev` for testing)
3. Get your API key from the dashboard
4. Add to `.env.local`:
   ```bash
   RESEND_API_KEY="re_..."
   RESEND_FROM_EMAIL="noreply@yourdomain.com"
   ```

## Sending Emails

```typescript
import { sendEmail } from "@/lib/email";
import { welcomeEmail } from "@/lib/email/templates";

await sendEmail({
  to: "user@example.com",
  subject: "Welcome to Chefs Kiss!",
  html: welcomeEmail("John Doe"),
});
```

## Custom Templates

Create email templates in [lib/email/templates.tsx](../lib/email/templates.tsx):

```typescript
export const orderConfirmation = (orderNumber: string, total: number) => `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif;">
  <h1>Order Confirmed!</h1>
  <p>Order #${orderNumber}</p>
  <p>Total: $${total.toFixed(2)}</p>
</body>
</html>
`;
```

## Learn More

- [Resend Documentation](https://resend.com/docs)
