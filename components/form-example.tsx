"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

export function FormExample() {
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmittedData(data);
    reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Validation Example</CardTitle>
        <CardDescription>
          React Hook Form with Zod schema validation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Field>
              <Input id="name" {...register("name")} placeholder="John Doe" />
            </Field>
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Field>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="john@example.com"
              />
            </Field>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="message">Message</FieldLabel>
            <Field>
              <Textarea
                id="message"
                {...register("message")}
                placeholder="Tell us something..."
                rows={4}
              />
            </Field>
            {errors.message && (
              <p className="text-sm text-destructive">{errors.message.message}</p>
            )}
          </FieldGroup>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>

        {submittedData && (
          <div className="mt-6 rounded-lg bg-muted p-4">
            <p className="mb-2 font-semibold">Form Submitted Successfully!</p>
            <pre className="text-sm">
              {JSON.stringify(submittedData, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
