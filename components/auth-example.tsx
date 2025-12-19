"use client";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { signIn, signOut, useSession } from "@/lib/auth/client";

export function AuthExample() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentication Status</CardTitle>
        <CardDescription>
          Google OAuth authentication with BetterAuth
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {session?.user ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium">Signed in as:</p>
              <p className="text-lg font-semibold">{session.user.name}</p>
              <p className="text-sm text-muted-foreground">
                {session.user.email}
              </p>
            </div>
            <Button onClick={() => signOut()} variant="outline">
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-muted-foreground">You are not signed in.</p>
            <Button
              onClick={() =>
                signIn.social({
                  provider: "google",
                  callbackURL: "/",
                })
              }
            >
              Sign in with Google
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
