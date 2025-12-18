# Quick Setup Guide

Follow these steps to get your development environment running.

## Prerequisites

- Node.js 20+ installed
- pnpm installed (`npm install -g pnpm`)
- Docker Desktop installed and running

## Step-by-Step Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Database

```bash
docker compose up -d
```

Verify it's running:
```bash
docker ps
```

You should see `chefs-kiss-db` in the list.

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Generate auth secret:
```bash
openssl rand -base64 32
```

Edit `.env.local` and:
- Add the generated secret to `BETTER_AUTH_SECRET`
- Add your Google OAuth credentials (see below)
- Optionally add Resend API key for emails

### 4. Google OAuth Setup

1. Go to https://console.cloud.google.com
2. Create a new project (or select existing)
3. Navigate to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen if prompted
6. Application type: "Web application"
7. Add authorized redirect URI:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
8. Copy the Client ID and Client Secret
9. Add them to `.env.local`:
   ```
   GOOGLE_CLIENT_ID="your-client-id"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   ```

### 5. Initialize Database

Push the schema to your database:

```bash
pnpm db:push
```

### 6. Start Development Server

```bash
pnpm dev
```

Open http://localhost:3000

## Verify Everything Works

On the home page, you should see:

1. **Authentication Example** - Try signing in with Google
2. **tRPC Example** - Test the public API (type your name)
3. **Form Example** - Test form validation

If the protected tRPC query works after signing in, everything is set up correctly!

## Troubleshooting

### Database Connection Issues

Check if Docker is running:
```bash
docker ps
```

Restart the database:
```bash
docker compose restart
```

### Authentication Not Working

- Verify `BETTER_AUTH_SECRET` is set in `.env.local`
- Check Google OAuth credentials are correct
- Ensure redirect URI in Google Console matches exactly

### tRPC Errors

Check browser console for errors. Common issues:
- Missing environment variables
- Database not initialized (run `pnpm db:push`)

## Next Steps

- Read the [README.md](./README.md) for detailed documentation
- Explore the example components in `/components`
- Check out the tRPC routers in `/lib/trpc/routers`
- Review the database schema in `/lib/db/schema`

## Useful Commands

```bash
# View database in GUI
pnpm db:studio

# Stop database
docker compose down

# View logs
docker compose logs -f

# Reset database (WARNING: deletes all data)
docker compose down -v
pnpm db:push
```
