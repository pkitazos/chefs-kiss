# tRPC - Type-Safe API Layer

This project uses tRPC for end-to-end type-safe APIs with automatic TypeScript inference.

## Overview

- **API Framework**: tRPC
- **Data Fetching**: TanStack Query (React Query)
- **Serialization**: SuperJSON (handles Dates, BigInts, etc.)
- **Authentication**: Integrated with BetterAuth

## File Locations

- **Server Config**: [lib/trpc/init.ts](../lib/trpc/init.ts)
- **App Router**: [lib/trpc/routers/_app.ts](../lib/trpc/routers/_app.ts)
- **Example Router**: [lib/trpc/routers/example.ts](../lib/trpc/routers/example.ts)
- **Client Setup**: [lib/trpc/client.tsx](../lib/trpc/client.tsx)
- **API Handler**: [app/api/trpc/[trpc]/route.ts](../app/api/trpc/[trpc]/route.ts)

## Creating API Endpoints

### 1. Create a Router

Create a new file in `lib/trpc/routers/`:

```typescript
// lib/trpc/routers/posts.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../init";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const postsRouter = createTRPCRouter({
  // Public query - anyone can access
  list: publicProcedure.query(async () => {
    return await db.select().from(posts).where(eq(posts.published, true));
  }),

  // Protected query - requires authentication
  myPosts: protectedProcedure.query(async ({ ctx }) => {
    return await db
      .select()
      .from(posts)
      .where(eq(posts.authorId, ctx.session.user.id));
  }),

  // Mutation with input validation
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(200),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [post] = await db
        .insert(posts)
        .values({
          id: crypto.randomUUID(),
          title: input.title,
          content: input.content,
          authorId: ctx.session.user.id,
          published: false,
        })
        .returning();

      return post;
    }),

  // Delete with authorization check
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check ownership
      const post = await db
        .select()
        .from(posts)
        .where(eq(posts.id, input.id))
        .limit(1);

      if (!post[0] || post[0].authorId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      await db.delete(posts).where(eq(posts.id, input.id));
      return { success: true };
    }),
});
```

### 2. Add to App Router

Update [lib/trpc/routers/_app.ts](../lib/trpc/routers/_app.ts):

```typescript
import { createTRPCRouter } from "../init";
import { exampleRouter } from "./example";
import { postsRouter } from "./posts";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  posts: postsRouter, // Add your new router
});

export type AppRouter = typeof appRouter;
```

## Client Usage

### Queries

```tsx
"use client";

import { trpc } from "@/lib/trpc/client";

export function PostsList() {
  const { data, isLoading, error } = trpc.posts.list.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.map((post) => (
        <li key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </li>
      ))}
    </ul>
  );
}
```

### Mutations

```tsx
"use client";

import { trpc } from "@/lib/trpc/client";
import { useState } from "react";

export function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const utils = trpc.useUtils();
  const createPost = trpc.posts.create.useMutation({
    onSuccess: () => {
      // Invalidate and refetch
      utils.posts.list.invalidate();
      setTitle("");
      setContent("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPost.mutate({ title, content });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
      />
      <button type="submit" disabled={createPost.isPending}>
        {createPost.isPending ? "Creating..." : "Create Post"}
      </button>
      {createPost.error && <p>Error: {createPost.error.message}</p>}
    </form>
  );
}
```

### Optimistic Updates

```tsx
const deleteMutation = trpc.posts.delete.useMutation({
  onMutate: async (deletedPost) => {
    // Cancel outgoing refetches
    await utils.posts.list.cancel();

    // Snapshot previous value
    const previousPosts = utils.posts.list.getData();

    // Optimistically update
    utils.posts.list.setData(undefined, (old) =>
      old?.filter((post) => post.id !== deletedPost.id)
    );

    return { previousPosts };
  },
  onError: (err, deletedPost, context) => {
    // Rollback on error
    utils.posts.list.setData(undefined, context?.previousPosts);
  },
  onSettled: () => {
    // Refetch after mutation
    utils.posts.list.invalidate();
  },
});
```

## Procedure Types

### publicProcedure

Anyone can access (no authentication required):

```typescript
list: publicProcedure.query(async () => {
  return await db.select().from(posts);
});
```

### protectedProcedure

Requires authentication (automatic 401 if not signed in):

```typescript
myData: protectedProcedure.query(async ({ ctx }) => {
  // ctx.session.user is guaranteed to exist
  return await getUserData(ctx.session.user.id);
});
```

## Input Validation

Use Zod schemas for type-safe inputs:

```typescript
create: protectedProcedure
  .input(
    z.object({
      email: z.string().email(),
      age: z.number().min(18).max(120),
      role: z.enum(["user", "admin"]),
      metadata: z.record(z.string()).optional(),
    })
  )
  .mutation(async ({ input }) => {
    // input is fully typed based on Zod schema
    console.log(input.email); // string
    console.log(input.age); // number
  });
```

## Error Handling

### Server-Side

```typescript
import { TRPCError } from "@trpc/server";

delete: protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const item = await db.query.items.findFirst({
      where: eq(items.id, input.id),
    });

    if (!item) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Item not found",
      });
    }

    if (item.userId !== ctx.session.user.id) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You can only delete your own items",
      });
    }

    await db.delete(items).where(eq(items.id, input.id));
  });
```

### Client-Side

```tsx
const { data, error } = trpc.posts.get.useQuery({ id: "123" });

if (error) {
  if (error.data?.code === "NOT_FOUND") {
    return <div>Post not found</div>;
  }
  if (error.data?.code === "UNAUTHORIZED") {
    return <div>Please sign in</div>;
  }
  return <div>Error: {error.message}</div>;
}
```

## Advanced Patterns

### Shared Validation Schemas

Create reusable schemas in `lib/validations/`:

```typescript
// lib/validations/posts.ts
import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
```

Use in both tRPC and forms:

```typescript
// tRPC procedure
import { createPostSchema } from "@/lib/validations/posts";

create: protectedProcedure
  .input(createPostSchema)
  .mutation(async ({ input }) => { ... });

// React Hook Form
import { createPostSchema } from "@/lib/validations/posts";
import { zodResolver } from "@hookform/resolvers/zod";

const form = useForm({
  resolver: zodResolver(createPostSchema),
});
```

### Pagination

```typescript
list: publicProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(100).default(10),
      cursor: z.string().optional(),
    })
  )
  .query(async ({ input }) => {
    const items = await db
      .select()
      .from(posts)
      .limit(input.limit + 1)
      .where(input.cursor ? gt(posts.id, input.cursor) : undefined);

    let nextCursor: string | undefined = undefined;
    if (items.length > input.limit) {
      const nextItem = items.pop();
      nextCursor = nextItem?.id;
    }

    return {
      items,
      nextCursor,
    };
  });
```

Client usage:

```tsx
const { data, fetchNextPage, hasNextPage } =
  trpc.posts.list.useInfiniteQuery(
    { limit: 10 },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );
```

## Type Safety Benefits

```typescript
// Full autocomplete
trpc.posts.create.useMutation();
trpc.posts.list.useQuery();

// Type-safe inputs
createPost.mutate({
  title: "Hello",
  content: "World",
});

// TypeScript error
createPost.mutate({
  title: 123, // Type error: expected string
  invalidField: "test", // Type error: unknown field
});

// Type-safe outputs
const { data } = trpc.posts.list.useQuery();
// data is typed as Post[]
```

## Troubleshooting

### Type errors after adding new procedure
- Restart TypeScript server in your IDE
- Check that router is exported from `_app.ts`

### Mutations not refetching data
- Use `utils.posts.list.invalidate()` after mutation
- Or use optimistic updates (see example above)

### CORS errors
- tRPC is configured for same-origin requests
- For different domains, update CORS settings in API route

## Learn More

- [tRPC Documentation](https://trpc.io/docs)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Zod Documentation](https://zod.dev)
