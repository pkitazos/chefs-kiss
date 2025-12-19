"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { trpc } from "@/lib/trpc/client";

export function TRPCExample() {
  const [name, setName] = useState("");
  const helloQuery = trpc.example.hello.useQuery(
    { name },
    { enabled: name.length > 0 }
  );
  const secretQuery = trpc.example.getSecretMessage.useQuery(undefined, {
    retry: false,
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Public tRPC Query</CardTitle>
          <CardDescription>
            Test a public endpoint that doesn&apos;t require authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {helloQuery.data && (
            <div className="rounded-lg bg-muted p-4">
              <p className="font-medium">{helloQuery.data.greeting}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Protected tRPC Query</CardTitle>
          <CardDescription>
            This endpoint requires authentication to access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => secretQuery.refetch()}
            disabled={secretQuery.isFetching}
          >
            {secretQuery.isFetching ? "Loading..." : "Fetch Secret Message"}
          </Button>
          {secretQuery.data && (
            <div className="rounded-lg bg-primary/10 p-4">
              <p className="font-medium text-primary">
                {secretQuery.data.message}
              </p>
            </div>
          )}
          {secretQuery.error && (
            <div className="rounded-lg bg-destructive/10 p-4">
              <p className="text-sm text-destructive">
                {secretQuery.error.message === "UNAUTHORIZED"
                  ? "Please sign in to access this message"
                  : "An error occurred"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
