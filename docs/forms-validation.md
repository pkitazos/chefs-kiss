# Forms & Validation

This project uses React Hook Form with Zod for type-safe form handling and validation.

## File Locations

- **Validation Schemas**: [lib/validations/](../lib/validations/)
- **Example Form**: [components/form-example.tsx](../components/form-example.tsx)

## Creating a Form

### 1. Define Zod Schema

```typescript
// lib/validations/contact.ts
import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
```

### 2. Create Form Component

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, type ContactFormData } from "@/lib/validations/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    // Submit to API
    await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(data),
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input {...register("name")} placeholder="Your name" />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Input {...register("email")} type="email" placeholder="Email" />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Textarea {...register("message")} placeholder="Message" rows={4} />
        {errors.message && (
          <p className="text-sm text-destructive">{errors.message.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
```

## Using with tRPC

Share validation schemas between client and server:

```typescript
// lib/validations/posts.ts
export const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
});

// In tRPC router
import { createPostSchema } from "@/lib/validations/posts";

create: protectedProcedure
  .input(createPostSchema)
  .mutation(async ({ input }) => { ... });

// In form component
import { createPostSchema } from "@/lib/validations/posts";

const form = useForm({
  resolver: zodResolver(createPostSchema),
});
```

## Learn More

- [React Hook Form Documentation](https://react-hook-form.com)
- [Zod Documentation](https://zod.dev)
