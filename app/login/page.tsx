"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn } from "@/lib/auth/client";
import { IconBrandGoogle } from "@tabler/icons-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>
            Sign in with your authorized Google account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                Your email is not authorized. Contact admin for access.
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={() =>
              signIn.social({
                provider: "google",
                callbackURL: "/admin",
                errorCallbackURL: "/login?error=unauthorized",
              })
            }
            className="w-full"
            size="lg"
          >
            <IconBrandGoogle className="mr-2 h-5 w-5" />
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
