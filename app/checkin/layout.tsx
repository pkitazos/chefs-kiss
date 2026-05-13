import type { Metadata } from "next";
import { getEnrichedSession } from "@/lib/auth";
import { userHasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { type ReactNode } from "react";

export const metadata: Metadata = {
  title: "Check-in",
  robots: "noindex, nofollow",
};

export default async function CheckInLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getEnrichedSession({
    headers: await headers(),
  });

  if (!session || !userHasPermission(session.user, "check_in.access")) {
    redirect("/login?redirect=/checkin");
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-4 mb-10">{children}</main>
    </div>
  );
}
