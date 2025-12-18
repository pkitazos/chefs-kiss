import { z } from "zod";

/**
 * Shared validation schemas
 * These can be used in both tRPC procedures and React Hook Form
 */

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

// Type inference examples
export type User = z.infer<typeof userSchema>;
export type ContactForm = z.infer<typeof contactFormSchema>;
