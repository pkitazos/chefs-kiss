# Database with Drizzle ORM

This project uses PostgreSQL with Drizzle ORM for type-safe database access.

## Overview

- **Database**: PostgreSQL 16
- **ORM**: Drizzle ORM
- **Development**: Docker Compose (local)
- **Migrations**: Drizzle Kit

## File Locations

- **Database Client**: [lib/db/index.ts](../lib/db/index.ts)
- **Schema Files**: [lib/db/schema/](../lib/db/schema/)
- **Migrations**: [lib/db/migrations/](../lib/db/migrations/)
- **Config**: [drizzle.config.ts](../drizzle.config.ts)

## Local Development

### Start Database

```bash
docker compose up -d
```

This starts PostgreSQL on `localhost:5432` with:
- Database: `chefs_kiss`
- Username: `postgres`
- Password: `postgres`

### Stop Database

```bash
docker compose down
```

### Reset Database (delete all data)

```bash
docker compose down -v
pnpm db:push
```

## Database Scripts

```bash
# Push schema changes to database (dev)
pnpm db:push

# Generate migration files
pnpm db:generate

# Run migrations
pnpm db:migrate

# Open Drizzle Studio (database GUI)
pnpm db:studio
```

## Schema Definition

### Creating Tables

Create schema files in [lib/db/schema/](../lib/db/schema/):

```typescript
// lib/db/schema/posts.ts
import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
import { users } from "./users";

export const posts = pgTable("post", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  content: text("content").notNull(),
  published: boolean("published").notNull().default(false),
  authorId: text("authorId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});
```

### Export Schema

Add to [lib/db/schema/index.ts](../lib/db/schema/index.ts):

```typescript
export * from "./users";
export * from "./posts"; // Add new schema
```

### Apply Changes

```bash
pnpm db:push
```

## Querying Data

### Import Database Client

```typescript
import { db } from "@/lib/db";
import { users, posts } from "@/lib/db/schema";
```

### Select Queries

```typescript
// Get all users
const allUsers = await db.select().from(users);

// Get user by ID
const user = await db
  .select()
  .from(users)
  .where(eq(users.id, userId))
  .limit(1);

// Get users with conditions
const activeUsers = await db
  .select()
  .from(users)
  .where(eq(users.emailVerified, true))
  .orderBy(desc(users.createdAt));
```

### Insert Queries

```typescript
// Insert single record
const newUser = await db
  .insert(users)
  .values({
    id: crypto.randomUUID(),
    name: "John Doe",
    email: "john@example.com",
    emailVerified: false,
  })
  .returning();

// Insert multiple records
await db.insert(posts).values([
  { title: "Post 1", content: "Content 1", authorId },
  { title: "Post 2", content: "Content 2", authorId },
]);
```

### Update Queries

```typescript
// Update specific record
await db
  .update(users)
  .set({ emailVerified: true })
  .where(eq(users.id, userId));

// Update multiple records
await db
  .update(posts)
  .set({ published: true })
  .where(eq(posts.authorId, userId));
```

### Delete Queries

```typescript
// Delete specific record
await db.delete(posts).where(eq(posts.id, postId));

// Delete with conditions
await db.delete(posts).where(eq(posts.published, false));
```

### Relations & Joins

```typescript
import { eq } from "drizzle-orm";

// Join tables
const postsWithAuthor = await db
  .select({
    post: posts,
    author: users,
  })
  .from(posts)
  .leftJoin(users, eq(posts.authorId, users.id));
```

## Using in tRPC

```typescript
import { createTRPCRouter, protectedProcedure } from "@/lib/trpc/init";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const postsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return await db
      .select()
      .from(posts)
      .where(eq(posts.authorId, ctx.session.user.id));
  }),

  create: protectedProcedure
    .input(z.object({ title: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await db.insert(posts).values({
        id: crypto.randomUUID(),
        title: input.title,
        content: input.content,
        authorId: ctx.session.user.id,
      });
    }),
});
```

## Migrations

### Development Workflow

For rapid development, use `db:push`:

```bash
# 1. Modify schema files
# 2. Push changes to database
pnpm db:push
```

### Production Workflow

For production, use migrations:

```bash
# 1. Modify schema files
# 2. Generate migration
pnpm db:generate

# 3. Review generated SQL in lib/db/migrations/
# 4. Run migration
pnpm db:migrate
```

## Type Safety

Drizzle provides full TypeScript type inference:

```typescript
// Type-safe
const user = await db.select().from(users).limit(1);
// user is typed as: { id: string, name: string, email: string, ... }[]

// TypeScript error - invalid column
const result = await db
  .select({ invalid: users.nonExistent })
  .from(users);

// Type-safe inserts
await db.insert(users).values({
  name: "John",
  email: "john@example.com",
  // TypeScript ensures all required fields are present
});
```

## Drizzle Studio

View and edit database with a GUI:

```bash
pnpm db:studio
```

Opens at: https://local.drizzle.studio

## Production Database

For production, use a hosted PostgreSQL service:

- [Vercel Postgres](https://vercel.com/storage/postgres)
- [Supabase](https://supabase.com)
- [Neon](https://neon.tech)
- [Railway](https://railway.app)

Update `DATABASE_URL` in your production environment variables.

## Troubleshooting

### Connection refused
- Ensure Docker is running: `docker ps`
- Restart database: `docker compose restart`

### Schema out of sync
- Push latest schema: `pnpm db:push`
- Or reset database: `docker compose down -v && pnpm db:push`

### Migration errors
- Review generated SQL in `lib/db/migrations/`
- Manually fix if needed
- Consider using `db:push` for development

## Learn More

- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Drizzle Kit Documentation](https://orm.drizzle.team/kit-docs/overview)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
