# Chef's Kiss Email Templates

Email templates for the Chef's Kiss Festival application.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the email previews.

## Deploy to Vercel

1. Navigate to this directory:
   ```bash
   cd emails
   ```

2. Deploy to Vercel:
   ```bash
   npx vercel
   ```

3. Follow the prompts to create a new project

4. For production deployment:
   ```bash
   npx vercel --prod
   ```

## Email Templates

- **vendor-confirmation.tsx** - Sent when a vendor submits their application
- **vendor-acceptance.tsx** - Sent when a vendor application is approved
- **vendor-rejection.tsx** - Sent when a vendor application is declined