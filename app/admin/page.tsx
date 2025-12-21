"use client";

import { useSession, signOut } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the Chef&apos;s Kiss event management system
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Logged in administrator account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Name</p>
            <p className="text-lg">{session?.user.name || "Not provided"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p className="text-lg">{session?.user.email}</p>
          </div>
          <Button
            onClick={() => {
              signOut();
              router.replace("/login");
            }}
            variant="outline"
            className="mt-4"
          >
            <IconLogout className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            Future admin features will be added here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
            <li>Vendor Application Management</li>
            <li>Workshop Management</li>
            <li>Dish Catalog Management</li>
            <li>Registration Overview</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
